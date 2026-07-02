const cardsGridNode = document.getElementById("cardsGrid");
const catalogView = document.getElementById("catalogView");
const detailsView = document.getElementById("detailsView");
const docsView = document.getElementById("docsView");
const docsBackButton = document.getElementById("docsBackButton");
const docsMenuButton = document.getElementById("docsMenuButton");
const docsDropdown = document.getElementById("docsDropdown");
const docsMenu = document.getElementById("docsMenu");
const docsAddGamesButton = document.getElementById("docsAddGamesButton");
const communityRatingRowNode = document.getElementById("communityRatingRow");
const communityRatingValNode = document.getElementById("communityRatingVal");
const communityRatingCountNode = document.getElementById("communityRatingCount");
const backButton = document.getElementById("backButton");
const heroVideoNode = document.getElementById("heroVideo");
const heroBackgroundNode = document.getElementById("heroBackground");
const heroLogoNode = document.getElementById("heroLogo");
const heroTitleNode = document.getElementById("heroTitle");
const heroSubtitleNode = document.getElementById("heroSubtitle");
const coverNode = document.getElementById("cover");
const titleNode = document.getElementById("title");
const descriptionNode = document.getElementById("description");
const recommendedWrapNode = document.getElementById("recommendedWrap");
const recommendedListNode = document.getElementById("recommendedList");
const metaBadgesNode = document.getElementById("metaBadges");
const ratingValueNode = document.getElementById("ratingValue");
const ratingVotesNode = document.getElementById("ratingVotes");
const ratingStarsNode = document.getElementById("ratingStars");
const metaFactsNode = document.getElementById("metaFacts");
const starButtons = Array.from(document.querySelectorAll(".star-btn"));
const tabScreensNode = document.getElementById("tabScreens");
const tabVideoNode = document.getElementById("tabVideo");
const tabCheatsNode = document.getElementById("tabCheats");
const panelScreensNode = document.getElementById("panelScreens");
const panelVideoNode = document.getElementById("panelVideo");
const panelCheatsNode = document.getElementById("panelCheats");
const screensGalleryNode = document.getElementById("screensGallery");
const walkthroughVideoNode = document.getElementById("walkthroughVideo");
const cheatsTextNode = document.getElementById("cheatsText");
const ostControlsNode = document.getElementById("ostControls");
const ostTabPlayerNode = document.getElementById("ostTabPlayer");
const ostTabPlaylistNode = document.getElementById("ostTabPlaylist");
const ostPanelPlayerNode = document.getElementById("ostPanelPlayer");
const ostPanelPlaylistNode = document.getElementById("ostPanelPlaylist");
const ostNowPlayingNode = document.getElementById("ostNowPlaying");
const ostPlaylistNowPlayingNode = document.getElementById("ostPlaylistNowPlaying");
const ostPlaylistNode = document.getElementById("ostPlaylist");
const ostPrevButton = document.getElementById("ostPrevButton");
const ostPauseButton = document.getElementById("ostPauseButton");
const ostNextButton = document.getElementById("ostNextButton");
const ostMuteButton = document.getElementById("ostMuteButton");
const ostVolumeSlider = document.getElementById("ostVolumeSlider");
const ostProgressSlider = document.getElementById("ostProgressSlider");
const ostCurrentTimeNode = document.getElementById("ostCurrentTime");
const ostDurationTimeNode = document.getElementById("ostDurationTime");
const playButton = document.getElementById("playButton");
const emulatorPanel = document.getElementById("emulatorPanel");
const emulatorContainer = document.getElementById("emulatorContainer");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const playersSelect = document.getElementById("playersSelect");
const letterSelect = document.getElementById("letterSelect");
const sortSelect = document.getElementById("sortSelect");
const bookmarkButton = document.getElementById("bookmarkButton");
const toggleMyGamesButton = document.getElementById("toggleMyGamesButton");
const toggleBookmarksButton = document.getElementById("toggleBookmarksButton");
const sidebar = document.getElementById("sidebar");
const layoutNode = document.querySelector(".layout");
const toggleFiltersButton = document.getElementById("toggleFiltersButton");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalPrevButton = document.getElementById("modalPrevButton");
const modalNextButton = document.getElementById("modalNextButton");
const modalCounterNode = document.getElementById("modalCounter");
const hoverPreviewNode = document.getElementById("hoverPreview");
const hoverPreviewTitleNode = document.getElementById("hoverPreviewTitle");
const hoverPreviewDescriptionNode = document.getElementById("hoverPreviewDescription");
const hoverPreviewScreensNode = document.getElementById("hoverPreviewScreens");
const actionTooltipNode = document.getElementById("actionTooltip");
const gamepadIndicatorNode = document.getElementById("gamepadIndicator");
const gamepadIndicatorNameNode = document.getElementById("gamepadIndicatorName");
const refreshGamesButton   = document.getElementById("refreshGamesButton");
const userProfileButton    = document.getElementById("userProfileButton");
const userAvatarCircle     = document.getElementById("userAvatarCircle");
const userLoginIcon        = document.getElementById("userLoginIcon");
const userButtonLabel      = document.getElementById("userButtonLabel");
const authOverlay          = document.getElementById("authOverlay");
const authCloseButton      = document.getElementById("authCloseButton");
const authTabLogin         = document.getElementById("authTabLogin");
const authTabRegister      = document.getElementById("authTabRegister");
const authNicknameInput    = document.getElementById("authNickname");
const authPasswordInput    = document.getElementById("authPassword");
const authErrorNode        = document.getElementById("authError");
const authSubmitButton     = document.getElementById("authSubmitButton");
const friendsPanel         = document.getElementById("friendsPanel");
const friendsPanelClose    = document.getElementById("friendsPanelClose");
const friendsPanelAvatar   = document.getElementById("friendsPanelAvatar");
const friendsPanelNickname = document.getElementById("friendsPanelNickname");
const friendsListNode      = document.getElementById("friendsList");
const addFriendInput       = document.getElementById("addFriendInput");
const addFriendButton      = document.getElementById("addFriendButton");
const addFriendError       = document.getElementById("addFriendError");
const logoutButton         = document.getElementById("logoutButton");

let games = [];
let filteredGames = [];
let selectedGame = null;
let communityRatings = {};
let isFiltersVisible = true;
let currentScreenIndex = 0;
let heroSlideIndex = 0;
let heroTimer = null;
let hoverPreviewTimer = null;
let hoverPreviewGame = null;
let hoverPreviewIndex = 0;
let lastHoverSoundAt = 0;
const USER_RATINGS_KEY   = "retro-user-ratings-v1";
const USER_BOOKMARKS_KEY = "retro-user-bookmarks-v1";
const USER_PLAYTIME_KEY  = "retro-user-playtime-v1";
const AUTH_TOKEN_KEY     = "retro-auth-token";
const AUTH_NICKNAME_KEY  = "retro-auth-nickname";

let authToken    = localStorage.getItem(AUTH_TOKEN_KEY)    || null;
let authNick     = localStorage.getItem(AUTH_NICKNAME_KEY) || null;
let authMode     = "login";
let heartbeatTimer        = null;
let friendsRefreshTimer   = null;
let currentPlayingGameId    = null;
let currentPlayingGameTitle = null;
const MY_GAMES_MIN_SECONDS = 3600;
const hoverSound = new Audio(new URL("../../source/sound/hover.mp3", window.location.href).href);
const choiceSound = new Audio(new URL("../../source/sound/choice.mp3", window.location.href).href);
const ostAudio = new Audio();
ostAudio.preload = "auto";
ostAudio.volume = 0.7;
let ostQueue = [];
let currentOstIndex = -1;
let isOstMuted = false;
let isOstPausedByUser = false;
let isSeekingOst = false;
/** Затухание OST при игре в отдельном окне или видео прохождения. */
const OST_DUCK_GAME_WINDOW = "ost-duck-game-window";
const OST_DUCK_WALKTHROUGH = "ost-duck-walkthrough";
const ostDuckTokens = new Set();
let ostVolumeFadeFrame = null;
let ostGameWindowSessions = 0;
let activeOstTab = "player";
let isBookmarksMode = false;
let isMyGamesMode = false;
let catalogFocusIndex = 0;
let gamepadLoopTimer = null;
const lastGamepadButtons = new Map();
const GAMEPAD_POLL_MS = 120;

function playUiSound(audio, { reset = true } = {}) {
  try {
    if (reset) audio.currentTime = 0;
    void audio.play();
  } catch {
    // Ignore autoplay/audio device errors; UI remains functional.
  }
}

function parseField(description, fieldName) {
  const regex = new RegExp(`^•\\s*${fieldName}:\\s*(.+)$`, "im");
  const match = description.match(regex);
  return match ? match[1].trim() : "";
}

function computePseudoRating(seedText) {
  const seed = [...seedText].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const raw = 6.8 + (seed % 24) / 10;
  return Math.min(9.2, raw).toFixed(1);
}

function getRatingTierClass(points) {
  if (points <= 4.5) return "rating-badge--red";
  if (points <= 7.4) return "rating-badge--yellow";
  return "rating-badge--green";
}

function getRatingTierColors(points) {
  if (points <= 4.5) return ["#ff5f5f", "#ff2d2d"];
  if (points <= 7.4) return ["#ffd86a", "#ff9f1a"];
  return ["#6dff9f", "#1ecb72"];
}

function pointsToStars(points) {
  return Math.max(1, Math.min(5, Math.round(points / 2)));
}

function starsToPoints(stars) {
  return stars * 2;
}

function pluralVotes(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "голос";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "голоса";
  return "голосов";
}

function renderStarsText(points) {
  const stars = pointsToStars(points);
  return `${"★".repeat(stars)}${"☆".repeat(5 - stars)}`;
}

function setActiveStarButtons(stars) {
  starButtons.forEach((btn) => {
    const value = Number(btn.dataset.star);
    btn.classList.toggle("active", value <= stars);
  });
}

function loadUserRatings() {
  try {
    return JSON.parse(localStorage.getItem(USER_RATINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function getUserRating(gameId) {
  const ratings = loadUserRatings();
  const value = Number(ratings[gameId]);
  return Number.isFinite(value) ? value : null;
}

function setUserRating(gameId, value) {
  const ratings = loadUserRatings();
  ratings[gameId] = value;
  localStorage.setItem(USER_RATINGS_KEY, JSON.stringify(ratings));
}

function loadBookmarks() {
  try {
    const raw = JSON.parse(localStorage.getItem(USER_BOOKMARKS_KEY) || "[]");
    return Array.isArray(raw) ? new Set(raw) : new Set();
  } catch {
    return new Set();
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(USER_BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
}

function isBookmarked(gameId) {
  return loadBookmarks().has(gameId);
}

function toggleBookmark(gameId) {
  const bookmarks = loadBookmarks();
  const nowBookmarked = !bookmarks.has(gameId);
  if (nowBookmarked) {
    bookmarks.add(gameId);
  } else {
    bookmarks.delete(gameId);
  }
  saveBookmarks(bookmarks);
  return nowBookmarked;
}

function updateBookmarkButtonState() {
  if (!selectedGame) return;
  const active = isBookmarked(selectedGame.id);
  bookmarkButton.classList.toggle("active", active);
  bookmarkButton.setAttribute("aria-pressed", active ? "true" : "false");
  const hint = active ? "Убрать из Буду играть" : "Добавить в Буду играть";
  bookmarkButton.setAttribute("title", hint);
  bookmarkButton.setAttribute("aria-label", hint);
}

function updateBookmarksModeButtonState() {
  toggleBookmarksButton.classList.toggle("active", isBookmarksMode);
  const label = isBookmarksMode ? "Показать все игры" : "Показать Буду играть";
  toggleBookmarksButton.title = label;
  toggleBookmarksButton.setAttribute("aria-label", label);
}

function loadPlaytime() {
  try {
    return JSON.parse(localStorage.getItem(USER_PLAYTIME_KEY) || "{}");
  } catch {
    return {};
  }
}

function getPlayedSeconds(gameId) {
  const map = loadPlaytime();
  const value = Number(map[gameId]);
  return Number.isFinite(value) ? value : 0;
}

function addPlayedSeconds(gameId, secondsToAdd) {
  if (!gameId || !Number.isFinite(secondsToAdd) || secondsToAdd <= 0) return;
  const map = loadPlaytime();
  const current = Number(map[gameId]) || 0;
  map[gameId] = Math.max(0, current + secondsToAdd);
  localStorage.setItem(USER_PLAYTIME_KEY, JSON.stringify(map));
}

function isMyGame(game) {
  return getUserRating(game.id) !== null || getPlayedSeconds(game.id) >= MY_GAMES_MIN_SECONDS;
}

function updateMyGamesModeButtonState() {
  toggleMyGamesButton.classList.toggle("active", isMyGamesMode);
  const label = isMyGamesMode ? "Показать все игры" : "Показать Мои игры";
  toggleMyGamesButton.title = label;
  toggleMyGamesButton.setAttribute("aria-label", label);
}

function parseFacts(description) {
  return description
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("•"))
    .map((line) => line.replace(/^•\s*/, "").trim())
    .slice(0, 4);
}

function buildMicroDescription(description) {
  const text = (description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("•"))
    .join(" ");

  if (!text) return "Описание недоступно.";
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function createCoverNode(game) {
  if (game.coverUrl) {
    const image = document.createElement("img");
    image.src = game.coverUrl;
    image.alt = game.title;
    return image;
  }

  const fallback = document.createElement("div");
  fallback.className = "card-cover-fallback";
  fallback.setAttribute("role", "img");
  fallback.setAttribute("aria-label", `Обложка для ${game.title} отсутствует`);

  const title = document.createElement("span");
  title.className = "card-cover-fallback-title";
  title.textContent = game.title;
  fallback.appendChild(title);

  return fallback;
}

function escapeHtml(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarkdown(markdown) {
  const source = (markdown || "").trim();
  if (!source) return "";

  const markdownEngine = window.marked?.marked || window.marked;
  if (!markdownEngine?.parse) {
    return `<pre>${escapeHtml(source)}</pre>`;
  }

  return markdownEngine.parse(source, {
    gfm: true,
    breaks: true,
    mangle: false,
    headerIds: false
  });
}

function getTrackName(trackUrl) {
  try {
    const pathname = new URL(trackUrl).pathname;
    const encodedName = pathname.split("/").pop() || "";
    return decodeURIComponent(encodedName).replace(/\.[^.]+$/, "") || "Неизвестный трек";
  } catch {
    return "Неизвестный трек";
  }
}

function formatAudioTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getOstUserVolume() {
  const raw = Number(ostVolumeSlider.value) / 100;
  return Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0.7;
}

function cancelOstVolumeFade() {
  if (ostVolumeFadeFrame !== null) {
    cancelAnimationFrame(ostVolumeFadeFrame);
    ostVolumeFadeFrame = null;
  }
}

function fadeOstVolumeTo(target, durationMs) {
  cancelOstVolumeFade();
  const from = ostAudio.volume;
  const goal = Math.max(0, Math.min(1, target));
  if (Math.abs(from - goal) < 0.002) {
    ostAudio.volume = goal;
    return;
  }
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    ostAudio.volume = from + (goal - from) * t;
    if (t < 1) {
      ostVolumeFadeFrame = requestAnimationFrame(tick);
    } else {
      ostVolumeFadeFrame = null;
      ostAudio.volume = goal;
    }
  }
  ostVolumeFadeFrame = requestAnimationFrame(tick);
}

function addOstDuck(token) {
  const hadDuck = ostDuckTokens.size > 0;
  ostDuckTokens.add(token);
  if (!hadDuck) {
    fadeOstVolumeTo(0, 520);
  }
}

function removeOstDuck(token) {
  if (!ostDuckTokens.delete(token)) return;
  if (ostDuckTokens.size === 0) {
    fadeOstVolumeTo(getOstUserVolume(), 880);
  }
}

function beginGameWindowAudioSession() {
  ostGameWindowSessions += 1;
  if (ostGameWindowSessions === 1) {
    addOstDuck(OST_DUCK_GAME_WINDOW);
  }
}

function endGameWindowAudioSession() {
  ostGameWindowSessions = Math.max(0, ostGameWindowSessions - 1);
  if (ostGameWindowSessions === 0) {
    removeOstDuck(OST_DUCK_GAME_WINDOW);
  }
}

function setActiveOstTab(tabName) {
  activeOstTab = tabName === "playlist" ? "playlist" : "player";
  const isPlaylist = activeOstTab === "playlist";
  ostTabPlayerNode.classList.toggle("active", !isPlaylist);
  ostTabPlaylistNode.classList.toggle("active", isPlaylist);
  ostPanelPlayerNode.classList.toggle("hidden", isPlaylist);
  ostPanelPlaylistNode.classList.toggle("hidden", !isPlaylist);
}

function renderOstPlaylist() {
  ostPlaylistNode.innerHTML = "";
  if (!ostQueue.length) return;

  ostQueue.forEach((trackUrl, index) => {
    const item = document.createElement("button");
    item.className = `ost-playlist-item${index === currentOstIndex ? " active" : ""}`;
    item.textContent = `${index + 1}. ${getTrackName(trackUrl)}`;
    item.title = getTrackName(trackUrl);
    item.addEventListener("click", () => {
      currentOstIndex = index;
      isOstPausedByUser = false;
      void playCurrentOstTrack();
    });
    ostPlaylistNode.appendChild(item);
  });

  const activeItem = ostPlaylistNode.querySelector(".ost-playlist-item.active");
  if (activeItem) {
    activeItem.scrollIntoView({ block: "nearest" });
  }
}

function updateOstProgressUi() {
  const duration = Number.isFinite(ostAudio.duration) ? ostAudio.duration : 0;
  const currentTime = Number.isFinite(ostAudio.currentTime) ? ostAudio.currentTime : 0;
  ostCurrentTimeNode.textContent = formatAudioTime(currentTime);
  ostDurationTimeNode.textContent = formatAudioTime(duration);
  ostProgressSlider.max = String(duration || 100);
  if (!isSeekingOst) {
    ostProgressSlider.value = String(Math.min(currentTime, duration || currentTime || 0));
  }
}

function updateOstUi() {
  if (!ostQueue.length) {
    ostControlsNode.classList.add("hidden");
    return;
  }

  ostControlsNode.classList.remove("hidden");
  const trackUrl = ostQueue[currentOstIndex] || "";
  const trackName = trackUrl ? getTrackName(trackUrl) : "—";
  ostNowPlayingNode.textContent = `OST: ${trackName}`;
  ostPlaylistNowPlayingNode.textContent = `Сейчас: ${trackName}`;
  ostPauseButton.setAttribute("aria-label", isOstPausedByUser ? "Играть" : "Пауза");
  ostPauseButton.classList.toggle("is-playing", !isOstPausedByUser);
  ostPauseButton.classList.toggle("is-paused", isOstPausedByUser);
  ostMuteButton.setAttribute("aria-label", isOstMuted ? "Включить звук" : "Выключить звук");
  ostMuteButton.classList.toggle("is-muted", isOstMuted);
  renderOstPlaylist();
  updateOstProgressUi();
}

async function playCurrentOstTrack() {
  if (!ostQueue.length || currentOstIndex < 0) {
    return;
  }

  ostAudio.src = ostQueue[currentOstIndex];
  ostAudio.muted = isOstMuted;
  updateOstUi();
  try {
    await ostAudio.play();
  } catch {
    // Ignore autoplay restrictions; user can press play.
  }
  if (ostDuckTokens.size > 0) {
    ostAudio.volume = 0;
  }
}

function stopOstPlayback() {
  cancelOstVolumeFade();
  ostAudio.pause();
  ostAudio.removeAttribute("src");
  ostAudio.load();
  ostQueue = [];
  currentOstIndex = -1;
  isOstPausedByUser = false;
  isSeekingOst = false;
  ostAudio.volume = ostDuckTokens.size > 0 ? 0 : getOstUserVolume();
  updateOstUi();
}

function startOstForGame(game) {
  const tracks = (game?.ostTracks || []).filter(Boolean);
  if (!tracks.length) {
    stopOstPlayback();
    return;
  }

  ostQueue = [...tracks];
  currentOstIndex = Math.floor(Math.random() * ostQueue.length);
  isOstPausedByUser = false;
  setActiveOstTab("player");
  void playCurrentOstTrack();
}

function normalizeTitle(text) {
  return (text || "")
    .toLowerCase()
    .replace(/\b(versus|vs)\b/g, " ")
    .replace(/\b(the|and|of)\b/g, " ")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleTokens(text) {
  return normalizeTitle(text)
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

function extractRecommendedTitles(description) {
  const match = (description || "").match(/Рекомендованные игры:\s*(.+)$/im);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripRecommendedLine(description) {
  return (description || "")
    .replace(/^.*Рекомендованные игры:.*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeGame(game) {
  const description = game.description || "";
  const genreRaw = parseField(description, "Жанр");
  const playersRaw = parseField(description, "Игроки");
  const genre = genreRaw || "Неизвестно";
  const players = Number.parseInt(playersRaw, 10) || 1;
  const firstLetter = (game.title || "").trim().charAt(0).toUpperCase() || "#";
  return { ...game, genre, players, firstLetter };
}

function fillFilterOptions() {
  const genres = [...new Set(games.map((game) => game.genre))].sort((a, b) => a.localeCompare(b));
  const letters = [...new Set(games.map((game) => game.firstLetter))].sort((a, b) =>
    a.localeCompare(b)
  );

  for (const genre of genres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  }

  for (const letter of letters) {
    const option = document.createElement("option");
    option.value = letter;
    option.textContent = letter;
    letterSelect.appendChild(option);
  }
}

function getFilteredGames() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreSelect.value;
  const selectedPlayers = playersSelect.value;
  const selectedLetter = letterSelect.value;
  const selectedSort = sortSelect.value;

  const list = [...games].filter((game) => {
    if (searchTerm && !game.title.toLowerCase().includes(searchTerm)) return false;
    if (selectedGenre !== "all" && game.genre !== selectedGenre) return false;
    if (selectedPlayers !== "all") {
      if (selectedPlayers === "3" && game.players < 3) return false;
      if (selectedPlayers !== "3" && game.players !== Number(selectedPlayers)) return false;
    }
    if (selectedLetter !== "all" && game.firstLetter !== selectedLetter) return false;
    if (isBookmarksMode && !isBookmarked(game.id)) return false;
    if (isMyGamesMode && !isMyGame(game)) return false;
    return true;
  });

  list.sort((a, b) =>
    selectedSort === "za" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
  );
  return list;
}

function normalizeFocusIndex() {
  if (!filteredGames.length) {
    catalogFocusIndex = 0;
    return;
  }
  catalogFocusIndex = Math.max(0, Math.min(catalogFocusIndex, filteredGames.length - 1));
}

function getCardsPerRow() {
  const firstCard = cardsGridNode.querySelector(".card");
  if (!firstCard) return 1;
  const cardWidth = firstCard.getBoundingClientRect().width || 1;
  const gridWidth = cardsGridNode.getBoundingClientRect().width || cardWidth;
  return Math.max(1, Math.floor(gridWidth / cardWidth));
}

function setCatalogFocus(index) {
  catalogFocusIndex = index;
  normalizeFocusIndex();
  renderCards();
  const targetCard = cardsGridNode.querySelector(".card.gamepad-focus");
  if (targetCard) {
    targetCard.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function renderCards() {
  cardsGridNode.innerHTML = "";
  if (!filteredGames.length) {
    cardsGridNode.innerHTML = '<div class="empty-state">Нет игр по выбранному фильтру.</div>';
    return;
  }

  filteredGames.forEach((game) => {
    const index = filteredGames.indexOf(game);
    const card = document.createElement("article");
    const isFocused = !catalogView.classList.contains("hidden") && index === catalogFocusIndex;
    card.className = `card${selectedGame?.id === game.id ? " active" : ""}${isFocused ? " gamepad-focus" : ""}`;
    card.addEventListener("click", () => {
      playUiSound(choiceSound);
      openGameDetails(game.id);
    });
    card.addEventListener("mouseenter", (event) => {
      const now = Date.now();
      if (now - lastHoverSoundAt > 120) {
        playUiSound(hoverSound);
        lastHoverSoundAt = now;
      }
      showHoverPreview(game, event);
    });
    card.addEventListener("mousemove", (event) => moveHoverPreview(event));
    card.addEventListener("mouseleave", () => hideHoverPreview());

    const poster = document.createElement("div");
    poster.className = "card-poster";
    poster.appendChild(createCoverNode(game));

    if (game.source === "local") {
      const localBadge = document.createElement("div");
      localBadge.className = "local-badge";
      localBadge.textContent = "Свои";
      poster.appendChild(localBadge);
    }

    const cardRating =
      getUserRating(game.id) ??
      communityRatings[game.id]?.average ??
      Number(computePseudoRating(game.title));
    const badge = document.createElement("div");
    badge.className = `rating-badge ${getRatingTierClass(cardRating)}`;
    badge.textContent = cardRating.toFixed(1);
    const [startColor, endColor] = getRatingTierColors(cardRating);
    badge.style.setProperty("--badge-start", startColor);
    badge.style.setProperty("--badge-end", endColor);
    poster.appendChild(badge);

    const userRating = getUserRating(game.id);
    if (userRating !== null) {
      const userBadge = document.createElement("div");
      userBadge.className = `rating-badge rating-badge-user ${getRatingTierClass(userRating)}`;
      userBadge.textContent = `Вы: ${userRating.toFixed(1)}`;
      const [userStartColor, userEndColor] = getRatingTierColors(userRating);
      userBadge.style.setProperty("--badge-start", userStartColor);
      userBadge.style.setProperty("--badge-end", userEndColor);
      poster.appendChild(userBadge);
    }

    const cardBookmarkButton = document.createElement("button");
    const bookmarked = isBookmarked(game.id);
    cardBookmarkButton.className = `card-bookmark-button${bookmarked ? " active" : ""}`;
    cardBookmarkButton.setAttribute("type", "button");
    cardBookmarkButton.setAttribute(
      "aria-label",
      bookmarked ? "Убрать из Буду играть" : "Добавить в Буду играть"
    );
    cardBookmarkButton.title = bookmarked ? "Убрать из Буду играть" : "Добавить в Буду играть";
    cardBookmarkButton.innerHTML = '<span class="icon icon-bookmark" aria-hidden="true"></span>';
    cardBookmarkButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const active = toggleBookmark(game.id);
      cardBookmarkButton.classList.toggle("active", active);
      cardBookmarkButton.setAttribute(
        "aria-label",
        active ? "Убрать из Буду играть" : "Добавить в Буду играть"
      );
      cardBookmarkButton.title = active ? "Убрать из Буду играть" : "Добавить в Буду играть";
      if (selectedGame?.id === game.id) {
        updateBookmarkButtonState();
      }
      if (isBookmarksMode) {
        applyFilters();
        return;
      }
      renderCards();
    });
    poster.appendChild(cardBookmarkButton);

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = game.title;

    card.append(poster, title);
    cardsGridNode.appendChild(card);
  });
}

function findGameByTitleApprox(title) {
  const normalizedTarget = normalizeTitle(title);
  const targetTokens = new Set(titleTokens(title));

  const exact = games.find((game) => {
    const normalizedGame = normalizeTitle(game.title);
    return normalizedGame === normalizedTarget || normalizedGame.includes(normalizedTarget);
  });
  if (exact) return exact;

  let bestMatch = null;
  let bestScore = 0;

  for (const game of games) {
    const gameTokens = new Set(titleTokens(game.title));
    if (!gameTokens.size || !targetTokens.size) {
      continue;
    }

    let common = 0;
    targetTokens.forEach((token) => {
      if (gameTokens.has(token)) common += 1;
    });

    const score = common / Math.max(targetTokens.size, gameTokens.size);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = game;
    }
  }

  return bestScore >= 0.5 ? bestMatch : null;
}

function renderRecommendedGames(currentGame) {
  recommendedListNode.innerHTML = "";
  const list = extractRecommendedTitles(currentGame.description || "");

  if (!list.length) {
    recommendedWrapNode.classList.add("hidden");
    return;
  }

  recommendedWrapNode.classList.remove("hidden");

  list.forEach((title) => {
    const linkedGame = findGameByTitleApprox(title);
    const item = document.createElement("button");
    item.className = `recommended-item${linkedGame ? " is-link" : " is-soon"}`;
    item.textContent = title;

    if (linkedGame) {
      item.title = "Открыть игру";
      item.addEventListener("click", () => {
        playUiSound(choiceSound);
        openGameDetails(linkedGame.id);
      });
      item.addEventListener("mouseenter", (event) => showHoverPreview(linkedGame, event));
      item.addEventListener("mousemove", (event) => moveHoverPreview(event));
      item.addEventListener("mouseleave", () => hideHoverPreview());
    } else {
      item.disabled = true;
      item.title = "скоро будет";
    }

    recommendedListNode.appendChild(item);
  });
}

function renderHoverPreviewScreens() {
  hoverPreviewScreensNode.innerHTML = "";
  const screens = hoverPreviewGame?.screens ?? [];
  if (!screens.length) {
    return;
  }

  const image = document.createElement("img");
  image.src = screens[hoverPreviewIndex % screens.length];
  image.alt = "preview";
  image.classList.add("active");
  hoverPreviewScreensNode.appendChild(image);
}

function moveHoverPreview(event) {
  const offsetX = 20;
  const offsetY = 18;
  const maxX = window.innerWidth - hoverPreviewNode.offsetWidth - 10;
  const maxY = window.innerHeight - hoverPreviewNode.offsetHeight - 10;
  const x = Math.min(maxX, event.clientX + offsetX);
  const y = Math.min(maxY, event.clientY + offsetY);
  hoverPreviewNode.style.left = `${Math.max(10, x)}px`;
  hoverPreviewNode.style.top = `${Math.max(10, y)}px`;
}

function showHoverPreview(game, event) {
  hoverPreviewGame = game;
  hoverPreviewIndex = 0;
  hoverPreviewTitleNode.textContent = game.title;
  hoverPreviewDescriptionNode.textContent = buildMicroDescription(game.description);
  renderHoverPreviewScreens();
  moveHoverPreview(event);
  hoverPreviewNode.classList.remove("hidden");

  if (hoverPreviewTimer) {
    window.clearInterval(hoverPreviewTimer);
  }
  hoverPreviewTimer = window.setInterval(() => {
    if (!hoverPreviewGame?.screens?.length) return;
    hoverPreviewIndex = (hoverPreviewIndex + 1) % hoverPreviewGame.screens.length;
    renderHoverPreviewScreens();
  }, 1200);
}

function hideHoverPreview() {
  hoverPreviewNode.classList.add("hidden");
  hoverPreviewGame = null;
  if (hoverPreviewTimer) {
    window.clearInterval(hoverPreviewTimer);
    hoverPreviewTimer = null;
  }
}

function moveActionTooltip(event) {
  const offsetX = 16;
  const offsetY = 14;
  const maxX = window.innerWidth - actionTooltipNode.offsetWidth - 10;
  const maxY = window.innerHeight - actionTooltipNode.offsetHeight - 10;
  const x = Math.min(maxX, event.clientX + offsetX);
  const y = Math.min(maxY, event.clientY + offsetY);
  actionTooltipNode.style.left = `${Math.max(10, x)}px`;
  actionTooltipNode.style.top = `${Math.max(10, y)}px`;
}

function showActionTooltip(text, event) {
  actionTooltipNode.textContent = text;
  actionTooltipNode.classList.remove("hidden");
  moveActionTooltip(event);
}

function hideActionTooltip() {
  actionTooltipNode.classList.add("hidden");
}

function normalizeScreenIndex() {
  const screens = selectedGame?.screens ?? [];
  if (!screens.length) {
    currentScreenIndex = 0;
    return;
  }

  currentScreenIndex = (currentScreenIndex + screens.length) % screens.length;
}

function renderScreensGallery(screenUrls = []) {
  screensGalleryNode.innerHTML = "";
  if (!screenUrls.length) {
    screensGalleryNode.innerHTML = '<div class="empty-state">Скриншоты не найдены.</div>';
    return;
  }

  screenUrls.forEach((screenUrl, index) => {
    const item = document.createElement("button");
    item.className = "screen-thumb";
    item.setAttribute("aria-label", "Увеличить скриншот");
    item.addEventListener("click", () => openImageModal(index));

    const image = document.createElement("img");
    image.src = screenUrl;
    image.alt = "screenshot";

    const zoom = document.createElement("span");
    zoom.className = "screen-thumb-zoom";
    zoom.textContent = "⤢";

    item.append(image, zoom);
    screensGalleryNode.appendChild(item);
  });
}

function updateModalSlide() {
  const screens = selectedGame?.screens ?? [];
  if (!screens.length) return;
  normalizeScreenIndex();
  modalImage.src = screens[currentScreenIndex];
  modalCounterNode.textContent = `${currentScreenIndex + 1} / ${screens.length}`;
}

function shiftModalScreen(step) {
  if (!(selectedGame?.screens?.length > 0)) return;
  currentScreenIndex += step;
  updateModalSlide();
}

function stopHeroSlideshow() {
  if (heroTimer) {
    window.clearInterval(heroTimer);
    heroTimer = null;
  }
}

function startHeroSlideshow() {
  stopHeroSlideshow();
  heroVideoNode.pause();
  heroVideoNode.removeAttribute("src");
  heroVideoNode.load();
  heroVideoNode.classList.add("hidden");
  heroBackgroundNode.classList.remove("hidden");

  if (selectedGame?.videoUrl) {
    heroVideoNode.src = selectedGame.videoUrl;
    heroVideoNode.classList.remove("hidden");
    heroBackgroundNode.classList.add("hidden");
    const playPromise = heroVideoNode.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
    return;
  }

  const screens = selectedGame?.screens ?? [];
  if (!screens.length) {
    heroBackgroundNode.src = selectedGame?.coverUrl || "";
    return;
  }

  heroSlideIndex = 0;
  heroBackgroundNode.src = screens[heroSlideIndex];
  heroTimer = window.setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % screens.length;
    heroBackgroundNode.style.opacity = "0.35";
    window.setTimeout(() => {
      heroBackgroundNode.src = screens[heroSlideIndex];
      heroBackgroundNode.style.opacity = "1";
    }, 170);
  }, 3000);
}

function renderHeroHeading(game) {
  const heroSection = detailsView.querySelector(".hero");
  const hasLogo = Boolean(game?.logoUrl);
  if (hasLogo) {
    heroLogoNode.src = game.logoUrl;
    heroLogoNode.classList.remove("hidden");
    heroTitleNode.classList.add("hidden");
    heroSubtitleNode.classList.remove("hidden");
    heroSection?.classList.add("hero--with-logo");
    return;
  }
  heroLogoNode.removeAttribute("src");
  heroLogoNode.classList.add("hidden");
  heroTitleNode.classList.remove("hidden");
  heroSubtitleNode.classList.remove("hidden");
  heroSection?.classList.remove("hero--with-logo");
}

function hideEmulator() {
  emulatorPanel.classList.add("hidden");
  emulatorContainer.innerHTML = "";
}

function setActiveMediaTab(tabName) {
  const tabs = [
    { name: "screens", tab: tabScreensNode, panel: panelScreensNode },
    { name: "video", tab: tabVideoNode, panel: panelVideoNode },
    { name: "cheats", tab: tabCheatsNode, panel: panelCheatsNode }
  ];

  tabs.forEach(({ name, tab, panel }) => {
    const isActive = name === tabName && !tab.classList.contains("hidden");
    tab.classList.toggle("active", isActive);
    panel.classList.toggle("hidden", !isActive);
  });
}

function setupMediaTabs(game) {
  const hasScreens = (game.screens || []).length > 0;
  const hasVideo = Boolean(game.videoUrl);
  const hasCheats = Boolean((game.cheatsText || "").trim());

  tabScreensNode.classList.toggle("hidden", !hasScreens);
  tabVideoNode.classList.toggle("hidden", !hasVideo);
  tabCheatsNode.classList.toggle("hidden", !hasCheats);

  if (hasVideo) {
    walkthroughVideoNode.src = game.videoUrl;
    walkthroughVideoNode.load();
  } else {
    walkthroughVideoNode.pause();
    walkthroughVideoNode.removeAttribute("src");
    walkthroughVideoNode.load();
  }

  cheatsTextNode.innerHTML = hasCheats
    ? renderMarkdown(game.cheatsText)
    : "<p>Чит-коды не найдены.</p>";
  cheatsTextNode.querySelectorAll("a").forEach((anchor) => {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noreferrer");
  });

  if (hasScreens) {
    setActiveMediaTab("screens");
  } else if (hasVideo) {
    setActiveMediaTab("video");
  } else {
    setActiveMediaTab("cheats");
  }
}

function selectGame(id) {
  selectedGame = filteredGames.find((game) => game.id === id) ?? games.find((game) => game.id === id) ?? null;
  renderCards();
  if (!selectedGame) return;

  currentScreenIndex = 0;
  heroTitleNode.textContent = selectedGame.title;
  renderHeroHeading(selectedGame);
  coverNode.src = selectedGame.coverUrl || "";
  titleNode.textContent = selectedGame.title;
  descriptionNode.textContent = stripRecommendedLine(selectedGame.description) || "Описание не найдено.";
  renderRecommendedGames(selectedGame);
  metaBadgesNode.innerHTML = "";
  [selectedGame.genre, `${selectedGame.players} игрок(а)`].forEach((badgeText) => {
    const badge = document.createElement("span");
    badge.className = "meta-badge";
    badge.textContent = badgeText;
    metaBadgesNode.appendChild(badge);
  });

  if (selectedGame.source === "local") {
    const localBadge = document.createElement("span");
    localBadge.className = "meta-badge meta-badge--local";
    localBadge.textContent = "Игра пользователя";
    metaBadgesNode.appendChild(localBadge);
  }

  const facts = parseFacts(selectedGame.description || "");
  metaFactsNode.innerHTML = "";
  facts.forEach((fact) => {
    const row = document.createElement("div");
    row.textContent = fact;
    metaFactsNode.appendChild(row);
  });

  const userRating = getUserRating(selectedGame.id);
  const community = communityRatings[selectedGame.id];
  const rating =
    userRating ??
    community?.average ??
    Number(computePseudoRating(selectedGame.title));
  ratingValueNode.textContent = Number(rating).toFixed(1);
  ratingVotesNode.textContent = userRating
    ? `Ваш рейтинг: ${pointsToStars(userRating)} / 5`
    : `${selectedGame.screens.length || 1} материалов`;

  if (community && community.count > 0) {
    communityRatingValNode.textContent = community.average.toFixed(1);
    communityRatingCountNode.textContent = `(${community.count} ${pluralVotes(community.count)})`;
    communityRatingRowNode.classList.remove("hidden");
  } else {
    communityRatingRowNode.classList.add("hidden");
  }
  ratingStarsNode.textContent = "";
  updateBookmarkButtonState();
  setActiveStarButtons(userRating ? pointsToStars(userRating) : 0);
  renderScreensGallery(selectedGame.screens || []);
  setupMediaTabs(selectedGame);
  startHeroSlideshow();
  startOstForGame(selectedGame);
  hideEmulator();
}

function openGameDetails(id) {
  hideHoverPreview();
  selectGame(id);
  if (!selectedGame) return;
  catalogView.classList.add("hidden");
  detailsView.classList.remove("hidden");
}

function openImageModal(index = 0) {
  currentScreenIndex = index;
  updateModalSlide();
  imageModal.classList.remove("hidden");
  modalImage.onload = () => {
    const targetWidth = modalImage.naturalWidth < 700 ? 700 : modalImage.naturalWidth;
    const maxAllowed = Math.floor(window.innerWidth * 0.9);
    modalImage.style.width = `${Math.min(targetWidth, maxAllowed)}px`;
  };
}

playButton.addEventListener("click", () => {
  if (!selectedGame) return;
  beginGameWindowAudioSession();
  currentPlayingGameId    = selectedGame.id;
  currentPlayingGameTitle = selectedGame.title;
  if (authToken) window.retroApi.userHeartbeat(authToken, selectedGame.id, selectedGame.title).catch(() => {});
  window.retroApi.openPlayer({
    title: selectedGame.title,
    romUrl: selectedGame.romUrl,
    gameId: selectedGame.id
  });
});

walkthroughVideoNode.addEventListener("playing", () => addOstDuck(OST_DUCK_WALKTHROUGH));
walkthroughVideoNode.addEventListener("pause", () => removeOstDuck(OST_DUCK_WALKTHROUGH));
walkthroughVideoNode.addEventListener("ended", () => removeOstDuck(OST_DUCK_WALKTHROUGH));

backButton.addEventListener("click", () => {
  hideHoverPreview();
  detailsView.classList.add("hidden");
  catalogView.classList.remove("hidden");
  stopHeroSlideshow();
  heroVideoNode.pause();
  heroVideoNode.removeAttribute("src");
  heroVideoNode.load();
  walkthroughVideoNode.pause();
  removeOstDuck(OST_DUCK_WALKTHROUGH);
  stopOstPlayback();
  hideEmulator();
});

ostAudio.addEventListener("ended", () => {
  if (!ostQueue.length) return;
  currentOstIndex = (currentOstIndex + 1) % ostQueue.length;
  isOstPausedByUser = false;
  void playCurrentOstTrack();
});

ostAudio.addEventListener("loadedmetadata", () => {
  updateOstProgressUi();
});

ostAudio.addEventListener("timeupdate", () => {
  updateOstProgressUi();
});

ostPauseButton.addEventListener("click", () => {
  if (!ostQueue.length) return;
  if (ostAudio.paused) {
    isOstPausedByUser = false;
    void ostAudio.play();
  } else {
    isOstPausedByUser = true;
    ostAudio.pause();
  }
  updateOstUi();
});

ostNextButton.addEventListener("click", () => {
  if (!ostQueue.length) return;
  currentOstIndex = (currentOstIndex + 1) % ostQueue.length;
  isOstPausedByUser = false;
  void playCurrentOstTrack();
});

ostPrevButton.addEventListener("click", () => {
  if (!ostQueue.length) return;
  currentOstIndex = (currentOstIndex - 1 + ostQueue.length) % ostQueue.length;
  isOstPausedByUser = false;
  void playCurrentOstTrack();
});

ostMuteButton.addEventListener("click", () => {
  isOstMuted = !isOstMuted;
  ostAudio.muted = isOstMuted;
  updateOstUi();
});

ostTabPlayerNode.addEventListener("click", () => setActiveOstTab("player"));
ostTabPlaylistNode.addEventListener("click", () => setActiveOstTab("playlist"));

if (window.retroApi?.onPlayerSessionEnded) {
  window.retroApi.onPlayerSessionEnded((payload) => {
    endGameWindowAudioSession();
    currentPlayingGameId    = null;
    currentPlayingGameTitle = null;
    if (authToken) window.retroApi.userHeartbeat(authToken, null, null).catch(() => {});
    const gameId   = payload?.gameId;
    const playedMs = Number(payload?.playedMs);
    if (!gameId || !Number.isFinite(playedMs)) return;
    addPlayedSeconds(gameId, playedMs / 1000);
    if (isMyGamesMode) applyFilters();
  });
}

ostVolumeSlider.addEventListener("input", () => {
  const volume = getOstUserVolume();
  if (ostDuckTokens.size === 0) {
    ostAudio.volume = volume;
  }
});

ostProgressSlider.addEventListener("input", () => {
  if (!ostQueue.length) return;
  isSeekingOst = true;
  const value = Number(ostProgressSlider.value);
  if (!Number.isFinite(value)) return;
  ostCurrentTimeNode.textContent = formatAudioTime(value);
});

ostProgressSlider.addEventListener("change", () => {
  if (!ostQueue.length) return;
  const value = Number(ostProgressSlider.value);
  if (!Number.isFinite(value)) return;
  ostAudio.currentTime = Math.max(0, value);
  isSeekingOst = false;
  updateOstProgressUi();
});

modalPrevButton.addEventListener("click", () => shiftModalScreen(-1));
modalNextButton.addEventListener("click", () => shiftModalScreen(1));

modalBackdrop.addEventListener("click", () => imageModal.classList.add("hidden"));
imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) imageModal.classList.add("hidden");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    imageModal.classList.add("hidden");
    return;
  }
  if (imageModal.classList.contains("hidden")) return;
  if (event.key === "ArrowRight") shiftModalScreen(1);
  if (event.key === "ArrowLeft") shiftModalScreen(-1);
});

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!selectedGame) return;
    const stars = Number(button.dataset.star);
    if (!Number.isFinite(stars)) return;
    const points = starsToPoints(stars);
    setUserRating(selectedGame.id, points);

    if (window.retroApi?.saveServerRating) {
      window.retroApi.saveServerRating(selectedGame.id, points).then((result) => {
        if (result && typeof result.average === "number") {
          communityRatings[selectedGame.id] = {
            average: result.average,
            count: result.count
          };
          if (selectedGame) selectGame(selectedGame.id);
        }
      });
    }

    selectGame(selectedGame.id);
  });
});

bookmarkButton.addEventListener("click", () => {
  if (!selectedGame) return;
  toggleBookmark(selectedGame.id);
  updateBookmarkButtonState();
  renderCards();
  if (isBookmarksMode) {
    applyFilters();
  }
});

[
  { node: bookmarkButton, text: "Буду играть" },
  { node: playButton, text: "Играть" }
].forEach(({ node, text }) => {
  node.addEventListener("mouseenter", (event) => showActionTooltip(text, event));
  node.addEventListener("mousemove", (event) => moveActionTooltip(event));
  node.addEventListener("mouseleave", () => hideActionTooltip());
});

tabScreensNode.addEventListener("click", () => setActiveMediaTab("screens"));
tabVideoNode.addEventListener("click", () => setActiveMediaTab("video"));
tabCheatsNode.addEventListener("click", () => setActiveMediaTab("cheats"));

function applyFilters() {
  filteredGames = getFilteredGames();
  normalizeFocusIndex();
  if (selectedGame && !filteredGames.some((game) => game.id === selectedGame.id)) {
    selectedGame = null;
  }
  renderCards();
}

/* ─── Gamepad helpers ──────────────────────────────────────────── */

function shortGamepadName(id) {
  if (/xbox/i.test(id)) return "Xbox";
  if (/dualshock\s*4|ps4/i.test(id)) return "DualShock 4";
  if (/dualsense|ps5/i.test(id)) return "DualSense";
  if (/nintendo|pro\s*controller/i.test(id)) return "Switch Pro";
  if (/8bitdo/i.test(id)) return "8BitDo";
  const clean = id.replace(/\(.*?\)/g, "").replace(/vendor.*$/i, "").trim();
  return clean.slice(0, 22) || "Gamepad";
}

function updateGamepadIndicator() {
  const pad = getPrimaryGamepad();
  if (pad) {
    gamepadIndicatorNameNode.textContent = shortGamepadName(pad.id);
    gamepadIndicatorNode.classList.remove("hidden");
  } else {
    gamepadIndicatorNode.classList.add("hidden");
  }
}

window.addEventListener("gamepadconnected", (e) => {
  gamepadIndicatorNameNode.textContent = shortGamepadName(e.gamepad.id);
  gamepadIndicatorNode.classList.remove("hidden");
});

window.addEventListener("gamepaddisconnected", () => {
  updateGamepadIndicator();
});

function getPrimaryGamepad() {
  const pads = navigator.getGamepads?.() || [];
  return Array.from(pads).find((pad) => pad && pad.connected) || null;
}

function buildPressedMap(gamepad) {
  const prev = lastGamepadButtons.get(gamepad.index) || [];
  const next = gamepad.buttons.map((btn) => Boolean(btn?.pressed));
  lastGamepadButtons.set(gamepad.index, next);
  const justPressed = (index) => next[index] && !prev[index];

  // Analog sticks: treat as held if magnitude > threshold
  const axisX = gamepad.axes[0] ?? 0;
  const axisY = gamepad.axes[1] ?? 0;
  const AXIS_THRESHOLD = 0.5;

  return {
    a:      justPressed(0),
    b:      justPressed(1),
    x:      justPressed(2),
    y:      justPressed(3),
    lb:     justPressed(4),
    rb:     justPressed(5),
    lt:     justPressed(6),
    rt:     justPressed(7),
    select: justPressed(8),
    start:  justPressed(9),
    up:     justPressed(12) || justPressed(12),
    down:   justPressed(13),
    left:   justPressed(14),
    right:  justPressed(15),
    // DPad OR left stick for navigation
    navUp:    justPressed(12) || (axisY < -AXIS_THRESHOLD && !(prev[12])),
    navDown:  justPressed(13) || (axisY >  AXIS_THRESHOLD && !(prev[13])),
    navLeft:  justPressed(14) || (axisX < -AXIS_THRESHOLD && !(prev[14])),
    navRight: justPressed(15) || (axisX >  AXIS_THRESHOLD && !(prev[15])),
    // Right stick Y for scrolling
    scrollUp:   (gamepad.axes[3] ?? 0) < -AXIS_THRESHOLD,
    scrollDown: (gamepad.axes[3] ?? 0) >  AXIS_THRESHOLD
  };
}

function gamepadNavSound() {
  const now = Date.now();
  if (now - lastHoverSoundAt > 120) {
    playUiSound(hoverSound);
    lastHoverSoundAt = now;
  }
}

function closeModalIfOpen() {
  if (imageModal.classList.contains("hidden")) return false;
  imageModal.classList.add("hidden");
  return true;
}

function handleCatalogGamepad(pressed) {
  if (!filteredGames.length) return;
  const rowStep = getCardsPerRow();
  let moved = false;
  if (pressed.navLeft)  { setCatalogFocus(catalogFocusIndex - 1);        moved = true; }
  if (pressed.navRight) { setCatalogFocus(catalogFocusIndex + 1);        moved = true; }
  if (pressed.navUp)    { setCatalogFocus(catalogFocusIndex - rowStep);  moved = true; }
  if (pressed.navDown)  { setCatalogFocus(catalogFocusIndex + rowStep);  moved = true; }
  if (moved) gamepadNavSound();

  if (pressed.a) {
    const game = filteredGames[catalogFocusIndex];
    if (game) {
      playUiSound(choiceSound);
      openGameDetails(game.id);
    }
  }
  // Y = фильтр,  Select = фильтр
  if (pressed.y || pressed.select) toggleFiltersButton.click();
  // X = закладки
  if (pressed.x) toggleBookmarksButton.click();
  // Start = Мои игры
  if (pressed.start) toggleMyGamesButton.click();
}

function handleDetailsGamepad(pressed) {
  // Модалка скриншотов
  if (!imageModal.classList.contains("hidden")) {
    if (pressed.navLeft || pressed.lb)  shiftModalScreen(-1);
    if (pressed.navRight || pressed.rb) shiftModalScreen(1);
    if (pressed.b || pressed.a || pressed.start) closeModalIfOpen();
    return;
  }

  // Назад
  if (pressed.b || pressed.select) {
    backButton.click();
    return;
  }

  // Играть
  if (pressed.a || pressed.start) playButton.click();

  // Буду играть
  if (pressed.x && selectedGame) bookmarkButton.click();

  // Табы медиа
  if (pressed.lb && !tabScreensNode.classList.contains("hidden")) setActiveMediaTab("screens");
  if (pressed.rb && !tabVideoNode.classList.contains("hidden"))   setActiveMediaTab("video");
  if (pressed.y  && !tabCheatsNode.classList.contains("hidden"))  setActiveMediaTab("cheats");

  // Прокрутка страницы (DPad вверх/вниз или правый стик)
  const SCROLL_STEP = 180;
  if (pressed.navUp   || pressed.scrollUp)   window.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" });
  if (pressed.navDown || pressed.scrollDown) window.scrollBy({ top:  SCROLL_STEP, behavior: "smooth" });
}

function handleDocsGamepad(pressed) {
  if (pressed.b || pressed.select || pressed.start) docsBackButton.click();
}

function startGamepadSupport() {
  if (!navigator.getGamepads) return;
  updateGamepadIndicator();
  if (gamepadLoopTimer) window.clearInterval(gamepadLoopTimer);
  gamepadLoopTimer = window.setInterval(() => {
    const pad = getPrimaryGamepad();
    if (!pad) return;
    const pressed = buildPressedMap(pad);
    if (!docsView.classList.contains("hidden")) {
      handleDocsGamepad(pressed);
    } else if (!catalogView.classList.contains("hidden")) {
      handleCatalogGamepad(pressed);
    } else {
      handleDetailsGamepad(pressed);
    }
  }, GAMEPAD_POLL_MS);
}

function bindFilters() {
  [searchInput, genreSelect, playersSelect, letterSelect, sortSelect].forEach((node) => {
    node.addEventListener("input", applyFilters);
    node.addEventListener("change", applyFilters);
  });

  toggleFiltersButton.addEventListener("click", () => {
    isFiltersVisible = !isFiltersVisible;
    sidebar.classList.toggle("hidden", !isFiltersVisible);
    layoutNode.classList.toggle("filters-hidden", !isFiltersVisible);
    const label = isFiltersVisible ? "Скрыть фильтр" : "Показать фильтр";
    toggleFiltersButton.title = label;
    toggleFiltersButton.setAttribute("aria-label", label);
  });

  toggleBookmarksButton.addEventListener("click", () => {
    isBookmarksMode = !isBookmarksMode;
    if (isBookmarksMode) {
      isMyGamesMode = false;
      updateMyGamesModeButtonState();
    }
    updateBookmarksModeButtonState();
    applyFilters();
  });

  toggleMyGamesButton.addEventListener("click", () => {
    isMyGamesMode = !isMyGamesMode;
    if (isMyGamesMode) {
      isBookmarksMode = false;
      updateBookmarksModeButtonState();
    }
    updateMyGamesModeButtonState();
    applyFilters();
  });
}

function openDocsView() {
  catalogView.classList.add("hidden");
  detailsView.classList.add("hidden");
  docsView.classList.remove("hidden");
  closeDocsDropdown();
}

function closeDocsDropdown() {
  docsDropdown.classList.add("hidden");
  docsMenu.classList.remove("open");
  docsMenuButton.setAttribute("aria-expanded", "false");
}

docsMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = !docsDropdown.classList.contains("hidden");
  if (isOpen) {
    closeDocsDropdown();
  } else {
    docsDropdown.classList.remove("hidden");
    docsMenu.classList.add("open");
    docsMenuButton.setAttribute("aria-expanded", "true");
  }
});

docsAddGamesButton.addEventListener("click", () => {
  openDocsView();
});

docsBackButton.addEventListener("click", () => {
  docsView.classList.add("hidden");
  catalogView.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
  if (!docsMenu.contains(e.target)) {
    closeDocsDropdown();
  }
});

/* ══════════════════════════════════════════════════════════════
   Refresh games
   ══════════════════════════════════════════════════════════════ */

async function refreshGames() {
  const icon = refreshGamesButton.querySelector(".icon-refresh");
  icon.classList.add("spinning");
  refreshGamesButton.disabled = true;
  try {
    games = (await window.retroApi.listGames()).map(normalizeGame);
    fillFilterOptions();
    applyFilters();
  } finally {
    icon.classList.remove("spinning");
    refreshGamesButton.disabled = false;
  }
}

refreshGamesButton.addEventListener("click", refreshGames);

/* ══════════════════════════════════════════════════════════════
   Auth — user button & modal
   ══════════════════════════════════════════════════════════════ */

function updateUserButton() {
  if (authToken && authNick) {
    userAvatarCircle.textContent = authNick[0].toUpperCase();
    userAvatarCircle.classList.remove("hidden");
    userLoginIcon.classList.add("hidden");
    userButtonLabel.textContent = authNick;
  } else {
    userAvatarCircle.classList.add("hidden");
    userLoginIcon.classList.remove("hidden");
    userButtonLabel.textContent = "Войти";
  }
}

function setAuthMode(mode) {
  authMode = mode;
  authErrorNode.textContent = "";
  authErrorNode.classList.add("hidden");
  if (mode === "login") {
    authTabLogin.classList.add("active");
    authTabRegister.classList.remove("active");
    authSubmitButton.textContent = "Войти";
    authTabLogin.setAttribute("aria-selected", "true");
    authTabRegister.setAttribute("aria-selected", "false");
  } else {
    authTabRegister.classList.add("active");
    authTabLogin.classList.remove("active");
    authSubmitButton.textContent = "Зарегистрироваться";
    authTabRegister.setAttribute("aria-selected", "true");
    authTabLogin.setAttribute("aria-selected", "false");
  }
}

function showAuthModal() {
  setAuthMode("login");
  authNicknameInput.value = "";
  authPasswordInput.value = "";
  authOverlay.classList.remove("hidden");
  setTimeout(() => authNicknameInput.focus(), 50);
}

function hideAuthModal() {
  authOverlay.classList.add("hidden");
}

async function handleAuthSubmit() {
  const nickname = authNicknameInput.value.trim();
  const password = authPasswordInput.value;
  if (!nickname || !password) {
    authErrorNode.textContent = "Заполните все поля";
    authErrorNode.classList.remove("hidden");
    return;
  }
  authSubmitButton.disabled = true;
  authErrorNode.classList.add("hidden");

  const result = authMode === "login"
    ? await window.retroApi.authLogin(nickname, password)
    : await window.retroApi.authRegister(nickname, password);

  authSubmitButton.disabled = false;

  if (result?.error) {
    authErrorNode.textContent = result.error;
    authErrorNode.classList.remove("hidden");
    return;
  }

  authToken = result.token;
  authNick  = result.nickname;
  localStorage.setItem(AUTH_TOKEN_KEY,    authToken);
  localStorage.setItem(AUTH_NICKNAME_KEY, authNick);
  updateUserButton();
  hideAuthModal();
  startHeartbeat();
  openFriendsPanel();
}

userProfileButton.addEventListener("click", () => {
  if (authToken) { openFriendsPanel(); } else { showAuthModal(); }
});
authCloseButton.addEventListener("click", hideAuthModal);
authOverlay.addEventListener("click", (e) => { if (e.target === authOverlay) hideAuthModal(); });
authTabLogin.addEventListener("click",    () => setAuthMode("login"));
authTabRegister.addEventListener("click", () => setAuthMode("register"));
authSubmitButton.addEventListener("click", handleAuthSubmit);
authNicknameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") authPasswordInput.focus(); });
authPasswordInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleAuthSubmit(); });

/* ══════════════════════════════════════════════════════════════
   Heartbeat — keeps session alive + tracks current game
   ══════════════════════════════════════════════════════════════ */

function startHeartbeat() {
  stopHeartbeat();
  const send = async () => {
    if (!authToken) return;
    const result = await window.retroApi.userHeartbeat(authToken, currentPlayingGameId, currentPlayingGameTitle).catch(() => null);
    if (result?.error === "Сессия истекла") {
      authToken = null;
      authNick  = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_NICKNAME_KEY);
      stopHeartbeat();
      updateUserButton();
    }
  };
  send();
  heartbeatTimer = setInterval(send, 30_000);
}

function stopHeartbeat() {
  if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
}

/* ══════════════════════════════════════════════════════════════
   Friends panel
   ══════════════════════════════════════════════════════════════ */

function openFriendsPanel() {
  if (!authToken || !authNick) { showAuthModal(); return; }
  friendsPanelAvatar.textContent   = authNick[0].toUpperCase();
  friendsPanelNickname.textContent = authNick;
  friendsPanel.classList.remove("hidden");
  refreshFriends();
  if (friendsRefreshTimer) clearInterval(friendsRefreshTimer);
  friendsRefreshTimer = setInterval(refreshFriends, 30_000);
}

function closeFriendsPanel() {
  friendsPanel.classList.add("hidden");
  if (friendsRefreshTimer) { clearInterval(friendsRefreshTimer); friendsRefreshTimer = null; }
}

async function refreshFriends() {
  if (!authToken) return;
  const friends = await window.retroApi.friendsList(authToken).catch(() => []);
  if (!Array.isArray(friends) || friends.length === 0) {
    friendsListNode.innerHTML = '<p class="friends-empty">Список друзей пуст. Добавьте друга по никнейму.</p>';
    return;
  }
  friends.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
  friendsListNode.innerHTML = friends.map(f => {
    const statusText  = f.online ? (f.currentGameTitle ? `Играет: ${f.currentGameTitle}` : "В сети") : "Не в сети";
    const statusClass = f.online ? "" : "offline";
    const joinBtn     = (f.online && f.currentGameId)
      ? `<button class="friend-join-btn" data-gameid="${f.currentGameId}">Открыть</button>`
      : "";
    return `<div class="friend-card">
      <div class="friend-avatar">${f.nickname[0].toUpperCase()}<span class="friend-online-dot ${statusClass}"></span></div>
      <div class="friend-info">
        <div class="friend-nickname">${f.nickname}</div>
        <div class="friend-status ${statusClass}">${statusText}</div>
      </div>
      ${joinBtn}
      <button class="friend-remove-btn" data-friendid="${f.id}" title="Удалить из друзей">&times;</button>
    </div>`;
  }).join("");

  friendsListNode.querySelectorAll(".friend-join-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const game = games.find(g => g.id === btn.dataset.gameid);
      if (game) { closeFriendsPanel(); selectGame(game); }
    });
  });
  friendsListNode.querySelectorAll(".friend-remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await window.retroApi.friendsRemove(authToken, btn.dataset.friendid).catch(() => {});
      refreshFriends();
    });
  });
}

async function addFriend() {
  const nickname = addFriendInput.value.trim();
  if (!nickname) return;
  if (!authToken) { showAuthModal(); return; }
  addFriendButton.disabled = true;
  addFriendError.classList.add("hidden");
  const result = await window.retroApi.friendsAdd(authToken, nickname).catch(() => ({ error: "Ошибка соединения" }));
  addFriendButton.disabled = false;
  if (result?.error) {
    addFriendError.textContent = result.error;
    addFriendError.classList.remove("hidden");
    return;
  }
  addFriendInput.value = "";
  refreshFriends();
}

async function logout() {
  if (authToken) await window.retroApi.authLogout(authToken).catch(() => {});
  authToken = null;
  authNick  = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_NICKNAME_KEY);
  stopHeartbeat();
  updateUserButton();
  closeFriendsPanel();
}

friendsPanelClose.addEventListener("click", closeFriendsPanel);
logoutButton.addEventListener("click",      logout);
addFriendButton.addEventListener("click",   addFriend);
addFriendInput.addEventListener("keydown",  (e) => { if (e.key === "Enter") addFriend(); });

/* ── Auth init ────────────────────────────────────────────────── */

async function initAuth() {
  updateUserButton();
  if (!authToken) return;
  const result = await window.retroApi.userHeartbeat(authToken, null, null).catch(() => null);
  if (!result || result.error) {
    authToken = null;
    authNick  = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_NICKNAME_KEY);
    updateUserButton();
  } else {
    startHeartbeat();
  }
}

async function bootstrap() {
  if (window.retroApi?.getServerRatings) {
    window.retroApi.getServerRatings().then((data) => {
      if (data && typeof data === "object") {
        communityRatings = data;
      }
    });
  }

  games = (await window.retroApi.listGames()).map(normalizeGame);
  if (!games.length) {
    cardsGridNode.innerHTML = '<div class="empty-state">Игры не найдены.</div>';
    return;
  }
  fillFilterOptions();
  bindFilters();
  isFiltersVisible = false;
  sidebar.classList.add("hidden");
  layoutNode.classList.add("filters-hidden");
  toggleFiltersButton.title = "Показать фильтр";
  toggleFiltersButton.setAttribute("aria-label", "Показать фильтр");
  updateBookmarksModeButtonState();
  updateMyGamesModeButtonState();
  selectedGame = null;
  applyFilters();
  startGamepadSupport();
  await initAuth();
}

bootstrap();
