import { contextBridge, ipcRenderer } from "electron";
import Draft from "./database/entities/Draft";

contextBridge.exposeInMainWorld("electron", {
  getTables: () => ipcRenderer.invoke("getTables"),
  saveDraft: (data: Draft) => ipcRenderer.invoke("drafts.save", data),
});

contextBridge.exposeInMainWorld(
  "backendUrl",
  `http://localhost:${process.env.API_PORT}`
);
