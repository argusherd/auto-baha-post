import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
  publishNow: (postId: number) => ipcRenderer.send("publishNow", postId),
  getPostProperties: async (boardId: number) =>
    await ipcRenderer.invoke("getPostProperties", boardId),
  refreshLoginStatus: (callback: any) =>
    ipcRenderer.on("refreshLoginStatus", callback),
  getLng: () => async () => await ipcRenderer.invoke("getLng"),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);

contextBridge.exposeInMainWorld("lng", process.env.LNG);
