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
    ipcRenderer.invoke("ratings:set", { gameId, value })
});
