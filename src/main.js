const path = require("node:path");
const fs = require("node:fs/promises");
const { app, BrowserWindow, ipcMain } = require("electron");

const SERVER_BASE_URL = "http://45.12.72.82:3721";
const gamesRoot = path.join(app.getAppPath(), "games", "SMD");
let mainWindow = null;

function toWebPath(filePath) {
  return `file://${filePath.replace(/\\/g, "/")}`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readInfo(infoPath) {
  if (!(await exists(infoPath))) {
    return "";
  }

  try {
    return await fs.readFile(infoPath, "utf8");
  } catch {
    return "";
  }
}

async function readText(filePath) {
  if (!(await exists(filePath))) {
    return "";
  }

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function listScreens(screensDir) {
  if (!(await exists(screensDir))) {
    return [];
  }

  const entries = await fs.readdir(screensDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(screensDir, name));
}

async function listOstTracks(ostDir) {
  if (!(await exists(ostDir))) {
    return [];
  }

  const entries = await fs.readdir(ostDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((file) => /\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(ostDir, name));
}

async function loadLocalGames() {
  if (!(await exists(gamesRoot))) {
    return [];
  }

  const entries = await fs.readdir(gamesRoot, { withFileTypes: true });
  const gameDirs = entries.filter((entry) => entry.isDirectory());
  const games = [];

  for (const dir of gameDirs) {
    const gameDir = path.join(gamesRoot, dir.name);
    const files = await fs.readdir(gameDir, { withFileTypes: true });

    const rom = files
      .filter((item) => item.isFile())
      .map((item) => item.name)
      .find((name) => /\.gen$/i.test(name));

    if (!rom) {
      continue;
    }

    const cover = files
      .filter((item) => item.isFile())
      .map((item) => item.name)
      .find((name) => /^cover\.(png|jpg|jpeg|webp)$/i.test(name));
    const logo = files
      .filter((item) => item.isFile())
      .map((item) => item.name)
      .find((name) => /^logo\.png$/i.test(name));

    const video = files
      .filter((item) => item.isFile())
      .map((item) => item.name)
      .find((name) => /\.(mp4|webm|m4v|mov)$/i.test(name));

    const infoText = await readInfo(path.join(gameDir, "info.data"));
    const cheatsText = await readText(path.join(gameDir, "cheats.md"));
    const screens = await listScreens(path.join(gameDir, "screens"));
    const ostTracks = await listOstTracks(path.join(gameDir, "OST"));
    const title = infoText.split(/\r?\n/).find(Boolean)?.trim() || dir.name;

    games.push({
      id: dir.name,
      title,
      description: infoText,
      cheatsText,
      coverUrl: cover ? toWebPath(path.join(gameDir, cover)) : null,
      logoUrl: logo ? toWebPath(path.join(gameDir, logo)) : null,
      videoUrl: video ? toWebPath(path.join(gameDir, video)) : null,
      romUrl: toWebPath(path.join(gameDir, rom)),
      screens: screens.map((p) => toWebPath(p)),
      ostTracks: ostTracks.map((p) => toWebPath(p)),
      source: "local"
    });
  }

  return games.sort((a, b) => a.title.localeCompare(b.title));
}

async function loadServerGames() {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/games`, {
      signal: AbortSignal.timeout(10_000)
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#11141a",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

function createPlayerWindow({ title, romUrl, gameId }) {
  const startedAt = Date.now();
  const playerWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#05070c",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  playerWindow.loadFile(path.join(__dirname, "renderer", "player.html"), {
    query: {
      title: title || "SMD Game",
      romUrl: romUrl || ""
    }
  });

  playerWindow.on("closed", () => {
    const playedMs = Math.max(0, Date.now() - startedAt);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("player:session-ended", {
        gameId: gameId || null,
        playedMs
      });
    }
  });
}

ipcMain.handle("games:list", async () => {
  const [serverGames, localGames] = await Promise.all([
    loadServerGames(),
    loadLocalGames()
  ]);

  // Server games take priority — local shown only if not on server
  const serverIds = new Set(serverGames.map((g) => g.id));
  const filtered = localGames.filter((g) => !serverIds.has(g.id));

  return [...serverGames, ...filtered].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
});

ipcMain.handle("player:open", async (_, payload) => {
  createPlayerWindow(payload || {});
  return true;
});

ipcMain.handle("ratings:get", async () => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/ratings`, {
      signal: AbortSignal.timeout(8_000)
    });
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
});

ipcMain.handle("ratings:set", async (_, { gameId, value }) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, value }),
      signal: AbortSignal.timeout(8_000)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
