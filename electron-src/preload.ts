import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
  publishNow: (postId: number) => ipcRenderer.send("publishNow", postId),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);
