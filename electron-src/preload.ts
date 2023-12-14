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
  downloadUpdate: () => ipcRenderer.send("downloadUpdate"),
  downloadProgress: (callback: Function) =>
    ipcRenderer.on("downloadProgress", (_event, progress: number) =>
      callback(progress),
    ),
  updateError: (callback: Function) =>
    ipcRenderer.on("updateError", (_event, errorMessage: string) =>
      callback(errorMessage),
    ),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`,
);

contextBridge.exposeInMainWorld("lng", process.env.LNG);
