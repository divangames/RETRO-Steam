const express = require("express");
const path = require("node:path");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");

const app = express();
const PORT = 3721;
const GAMES_ROOT = path.join(__dirname, "games", "SMD");
const DATA_DIR = path.join(__dirname, "data");
const RATINGS_FILE  = path.join(DATA_DIR, "ratings.json");
const USERS_FILE    = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const SESSION_TTL_MS = 12 * 60 * 1000; // 12 минут без активности
const BASE_URL = `http://45.12.72.82:${PORT}`;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(
  "/games",
  express.static(path.join(__dirname, "games"), {
    maxAge: "1h",
    setHeaders(res, filePath) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      // Allow range requests so video/audio streams correctly
      res.setHeader("Accept-Ranges", "bytes");
    }
  })
);

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readText(p) {
  if (!(await exists(p))) return "";
  try {
    return await fs.readFile(p, "utf8");
  } catch {
    return "";
  }
}

async function listFiles(dir, pattern) {
  if (!(await exists(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && pattern.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

function enc(s) {
  return encodeURIComponent(s);
}

let gamesCache = null;
let gamesCacheTime = 0;
const CACHE_TTL_MS = 60_000;

async function buildGamesList() {
  if (!(await exists(GAMES_ROOT))) return [];

  const entries = await fs.readdir(GAMES_ROOT, { withFileTypes: true });
  const games = [];

  for (const dir of entries.filter((e) => e.isDirectory())) {
    const gameDir = path.join(GAMES_ROOT, dir.name);
    const files = await fs.readdir(gameDir, { withFileTypes: true });
    const names = files.filter((f) => f.isFile()).map((f) => f.name);

    const rom = names.find((n) => /\.gen$/i.test(n));
    if (!rom) continue;

    const cover = names.find((n) => /^cover\.(png|jpg|jpeg|webp)$/i.test(n));
    const logo = names.find((n) => /^logo\.png$/i.test(n));
    const video = names.find((n) => /\.(mp4|webm|m4v|mov)$/i.test(n));

    const infoText = await readText(path.join(gameDir, "info.data"));
    const cheatsText = await readText(path.join(gameDir, "cheats.md"));

    const screenFiles = await listFiles(
      path.join(gameDir, "screens"),
      /\.(png|jpg|jpeg|webp)$/i
    );
    const ostFiles = await listFiles(
      path.join(gameDir, "OST"),
      /\.(mp3|ogg|wav|m4a|aac|flac)$/i
    );

    const urlBase = `${BASE_URL}/games/SMD/${enc(dir.name)}`;
    const title = infoText.split(/\r?\n/).find(Boolean)?.trim() || dir.name;

    games.push({
      id: dir.name,
      title,
      description: infoText,
      cheatsText,
      romUrl: `${urlBase}/${enc(rom)}`,
      coverUrl: cover ? `${urlBase}/${enc(cover)}` : null,
      logoUrl: logo ? `${urlBase}/logo.png` : null,
      videoUrl: video ? `${urlBase}/${enc(video)}` : null,
      screens: screenFiles.map((f) => `${urlBase}/screens/${enc(f)}`),
      ostTracks: ostFiles.map((f) => `${urlBase}/OST/${enc(f)}`),
      source: "server"
    });
  }

  return games.sort((a, b) => a.title.localeCompare(b.title));
}

app.get("/api/games", async (req, res) => {
  try {
    const now = Date.now();
    if (!gamesCache || now - gamesCacheTime > CACHE_TTL_MS) {
      gamesCache = await buildGamesList();
      gamesCacheTime = now;
    }
    res.json(gamesCache);
  } catch (err) {
    console.error("games list error:", err);
    res.status(500).json({ error: "Failed to load games" });
  }
});

async function loadRatings() {
  try {
    if (!(await exists(RATINGS_FILE))) return {};
    return JSON.parse(await fs.readFile(RATINGS_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function saveRatings(ratings) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(RATINGS_FILE, JSON.stringify(ratings, null, 2), "utf8");
}

app.get("/api/ratings", async (req, res) => {
  try {
    const raw = await loadRatings();
    const result = {};
    for (const [id, data] of Object.entries(raw)) {
      if (data.count > 0) {
        result[id] = {
          average: Number((data.total / data.count).toFixed(2)),
          count: data.count
        };
      }
    }
    res.json(result);
  } catch (err) {
    console.error("ratings get error:", err);
    res.status(500).json({ error: "Failed to load ratings" });
  }
});

app.post("/api/ratings", async (req, res) => {
  try {
    const { gameId, value } = req.body;
    if (
      typeof gameId !== "string" ||
      !gameId ||
      typeof value !== "number" ||
      value < 2 ||
      value > 10
    ) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    const ratings = await loadRatings();
    if (!ratings[gameId]) ratings[gameId] = { total: 0, count: 0 };
    ratings[gameId].total += value;
    ratings[gameId].count += 1;
    await saveRatings(ratings);
    const avg = Number((ratings[gameId].total / ratings[gameId].count).toFixed(2));
    res.json({ average: avg, count: ratings[gameId].count });
  } catch (err) {
    console.error("ratings post error:", err);
    res.status(500).json({ error: "Failed to save rating" });
  }
});

/* ─── User & session helpers ───────────────────────────────────── */

async function loadUsers() {
  try {
    if (!(await exists(USERS_FILE))) return {};
    return JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
  } catch { return {}; }
}

async function saveUsers(u) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(u, null, 2), "utf8");
}

async function loadSessions() {
  try {
    if (!(await exists(SESSIONS_FILE))) return {};
    return JSON.parse(await fs.readFile(SESSIONS_FILE, "utf8"));
  } catch { return {}; }
}

async function saveSessions(s) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(s, null, 2), "utf8");
}

function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(salt + password).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function generateId() {
  return crypto.randomBytes(8).toString("hex");
}

async function getSession(token) {
  if (!token) return null;
  const sessions = await loadSessions();
  const s = sessions[token];
  if (!s) return null;
  if (Date.now() - s.lastSeen > SESSION_TTL_MS) {
    delete sessions[token];
    await saveSessions(sessions);
    return null;
  }
  return s;
}

/* ─── Auth endpoints ───────────────────────────────────────────── */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || typeof nickname !== "string" || nickname.trim().length < 2 || nickname.trim().length > 20)
      return res.status(400).json({ error: "Никнейм: 2–20 символов" });
    if (!password || password.length < 4)
      return res.status(400).json({ error: "Пароль: минимум 4 символа" });

    const nick = nickname.trim();
    const key  = nick.toLowerCase();
    const users = await loadUsers();
    if (users[key]) return res.status(409).json({ error: "Никнейм уже занят" });

    const salt = crypto.randomBytes(16).toString("hex");
    const id   = generateId();
    users[key] = { id, nickname: nick, passwordHash: hashPassword(password, salt), passwordSalt: salt, friends: [], createdAt: Date.now() };
    await saveUsers(users);

    const token = generateToken();
    const sessions = await loadSessions();
    sessions[token] = { userId: id, nickname: nick, lastSeen: Date.now(), currentGameId: null, currentGameTitle: null };
    await saveSessions(sessions);

    res.json({ token, nickname: nick, id });
  } catch (err) {
    console.error("register:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password) return res.status(400).json({ error: "Заполните все поля" });

    const key = nickname.trim().toLowerCase();
    const users = await loadUsers();
    const user  = users[key];
    if (!user || hashPassword(password, user.passwordSalt) !== user.passwordHash)
      return res.status(401).json({ error: "Неверный никнейм или пароль" });

    const token = generateToken();
    const sessions = await loadSessions();
    sessions[token] = { userId: user.id, nickname: user.nickname, lastSeen: Date.now(), currentGameId: null, currentGameTitle: null };
    await saveSessions(sessions);

    res.json({ token, nickname: user.nickname, id: user.id });
  } catch (err) {
    console.error("login:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
      const sessions = await loadSessions();
      delete sessions[token];
      await saveSessions(sessions);
    }
    res.json({ ok: true });
  } catch { res.json({ ok: true }); }
});

/* ─── Heartbeat / online status ────────────────────────────────── */

app.post("/api/users/heartbeat", async (req, res) => {
  try {
    const { token, gameId, gameTitle } = req.body;
    if (!token) return res.status(401).json({ error: "Не авторизован" });
    const sessions = await loadSessions();
    if (!sessions[token]) return res.status(401).json({ error: "Сессия истекла" });
    sessions[token].lastSeen = Date.now();
    if (gameId     !== undefined) sessions[token].currentGameId    = gameId    || null;
    if (gameTitle  !== undefined) sessions[token].currentGameTitle = gameTitle || null;
    await saveSessions(sessions);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

app.get("/api/users/online", async (req, res) => {
  try {
    const sessions = await loadSessions();
    const now = Date.now();
    const online = Object.values(sessions)
      .filter(s => now - s.lastSeen < SESSION_TTL_MS)
      .map(s => ({ nickname: s.nickname, userId: s.userId, currentGameId: s.currentGameId, currentGameTitle: s.currentGameTitle }));
    res.json(online);
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

/* ─── Friends ───────────────────────────────────────────────────── */

app.post("/api/friends/add", async (req, res) => {
  try {
    const { token, nickname } = req.body;
    const session = await getSession(token);
    if (!session) return res.status(401).json({ error: "Не авторизован" });

    const targetKey = (nickname || "").trim().toLowerCase();
    if (!targetKey) return res.status(400).json({ error: "Укажите никнейм" });

    const users = await loadUsers();
    const target = users[targetKey];
    if (!target) return res.status(404).json({ error: "Пользователь не найден" });
    if (target.id === session.userId) return res.status(400).json({ error: "Нельзя добавить себя" });

    const meKey = Object.keys(users).find(k => users[k].id === session.userId);
    if (!meKey) return res.status(404).json({ error: "Пользователь не найден" });

    const me = users[meKey];
    if (me.friends.includes(target.id)) return res.status(409).json({ error: "Уже в списке друзей" });

    me.friends.push(target.id);
    await saveUsers(users);
    res.json({ ok: true, added: target.nickname });
  } catch (err) {
    console.error("friends/add:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/friends/remove", async (req, res) => {
  try {
    const { token, friendId } = req.body;
    const session = await getSession(token);
    if (!session) return res.status(401).json({ error: "Не авторизован" });

    const users = await loadUsers();
    const meKey = Object.keys(users).find(k => users[k].id === session.userId);
    if (!meKey) return res.status(404).json({ error: "Пользователь не найден" });

    users[meKey].friends = users[meKey].friends.filter(id => id !== friendId);
    await saveUsers(users);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Ошибка сервера" }); }
});

app.get("/api/friends", async (req, res) => {
  try {
    const session = await getSession(req.query.token);
    if (!session) return res.status(401).json({ error: "Не авторизован" });

    const users    = await loadUsers();
    const sessions = await loadSessions();
    const now      = Date.now();
    const me = Object.values(users).find(u => u.id === session.userId);
    if (!me) return res.status(404).json({ error: "Пользователь не найден" });

    const activeSessions = Object.values(sessions).filter(s => now - s.lastSeen < SESSION_TTL_MS);

    const friends = me.friends.map(fid => {
      const fu = Object.values(users).find(u => u.id === fid);
      if (!fu) return null;
      const fs2 = activeSessions.find(s => s.userId === fid);
      return { id: fid, nickname: fu.nickname, online: !!fs2, currentGameId: fs2?.currentGameId || null, currentGameTitle: fs2?.currentGameTitle || null };
    }).filter(Boolean);

    res.json(friends);
  } catch (err) {
    console.error("friends/get:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/reload", (_, res) => {
  gamesCache = null;
  gamesCacheTime = 0;
  res.json({ ok: true, message: "Games cache cleared" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RETRO API server listening on port ${PORT}`);
});
