import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getTables: () => ipcRenderer.invoke("getTables"),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);
