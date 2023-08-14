import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  openBaha: () => ipcRenderer.send("openBaha"),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);
