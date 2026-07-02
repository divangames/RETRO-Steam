const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("retroApi", {
  listGames: () => ipcRenderer.invoke("games:list"),
  openPlayer: (payload) => ipcRenderer.invoke("player:open", payload),
  onPlayerSessionEnded: (handler) => {
    if (typeof handler !== "function") return () => {};
    const listener = (_, payload) => handler(payload);
    ipcRenderer.on("player:session-ended", listener);
    return () => ipcRenderer.removeListener("player:session-ended", listener);
  },
  getServerRatings: () => ipcRenderer.invoke("ratings:get"),
  saveServerRating: (gameId, value) =>
    ipcRenderer.invoke("ratings:set", { gameId, value }),

  // Auth
  authRegister:  (nickname, password) => ipcRenderer.invoke("auth:register",  { nickname, password }),
  authLogin:     (nickname, password) => ipcRenderer.invoke("auth:login",     { nickname, password }),
  authLogout:    (token)              => ipcRenderer.invoke("auth:logout",     { token }),

  // Online presence
  userHeartbeat: (token, gameId, gameTitle) => ipcRenderer.invoke("user:heartbeat", { token, gameId, gameTitle }),
  usersOnline:   ()                   => ipcRenderer.invoke("users:online"),

  // Friends
  friendsList:   (token)              => ipcRenderer.invoke("friends:list",   { token }),
  friendsAdd:    (token, nickname)    => ipcRenderer.invoke("friends:add",    { token, nickname }),
  friendsRemove: (token, friendId)    => ipcRenderer.invoke("friends:remove", { token, friendId })
});
