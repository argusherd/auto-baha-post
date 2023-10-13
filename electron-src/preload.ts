import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
  publishNow: (postId: number) => ipcRenderer.send("publishNow", postId),
  getPostProperties: (boardId: number) =>
    ipcRenderer.send("getPostProperties", boardId),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);
