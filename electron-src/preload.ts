import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getTables: () => ipcRenderer.invoke("getTables"),
});
