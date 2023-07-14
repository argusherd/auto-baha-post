import { ipcMain } from "electron";
import { DataSource } from "typeorm";
import { resolveDB } from "./database/connection";
import Draft from "./database/entities/Draft";

let DB: DataSource;

export default function registerIpcMain() {
  DB = resolveDB();

  ipcMain.handle("getTables", getTables);
  ipcMain.handle("drafts.save", (_event, args) => saveDraft(args));
}

async function getTables() {
  return await DB.query("select name from sqlite_master");
}

async function saveDraft(data: Draft) {
  const draft = new Draft();
  ({ subject: draft.subject, content: draft.content } = data);
  await draft.save();
}
