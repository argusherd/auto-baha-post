import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
  publishNow: (postId: number) => ipcRenderer.send("publishNow", postId),
  getPostProperties: async (boardId: number) =>
    await ipcRenderer.invoke("getPostProperties", boardId),
  loginStatusRefreshed: (callback: any) =>
    ipcRenderer.on("loginStatusRefreshed", callback),
  refreshLoginStatus: async () =>
    await ipcRenderer.invoke("refreshLoginStatus"),
  getLng: () => async () => await ipcRenderer.invoke("getLng"),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`,
);

contextBridge.exposeInMainWorld("lng", process.env.LNG);
