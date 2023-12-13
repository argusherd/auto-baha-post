import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
  publishNow: async (postId: number) =>
    await ipcRenderer.invoke("publishNow", postId),
  getPostProperties: async (boardId: number) =>
    await ipcRenderer.invoke("getPostProperties", boardId),
  loginStatusRefreshed: (callback: Function) =>
    ipcRenderer.on("loginStatusRefreshed", () => callback()),
  refreshLoginStatus: async () =>
    await ipcRenderer.invoke("refreshLoginStatus"),
  checkUpdate: () => ipcRenderer.send("checkUpdate"),
  updateAvailable: (callback: Function) =>
    ipcRenderer.on("updateAvailable", () => callback()),
  updateNotAvailable: (callback: Function) =>
    ipcRenderer.on("updateNotAvailable", () => callback()),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`,
);

contextBridge.exposeInMainWorld("lng", process.env.LNG);
