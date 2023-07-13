import { DraftType } from "@/interfaces/drafts";
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getTables: () => ipcRenderer.invoke("getTables"),
  saveDraft: (data: DraftType) => ipcRenderer.invoke("drafts.save", data),
});
