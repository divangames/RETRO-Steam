const express = require("express");
const path = require("node:path");
const fs = require("node:fs/promises");

const app = express();
const PORT = 3721;
const GAMES_ROOT = path.join(__dirname, "games", "SMD");
const DATA_DIR = path.join(__dirname, "data");
const RATINGS_FILE = path.join(DATA_DIR, "ratings.json");
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

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/api/reload", (_, res) => {
  gamesCache = null;
  gamesCacheTime = 0;
  res.json({ ok: true, message: "Games cache cleared" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RETRO API server listening on port ${PORT}`);
});
