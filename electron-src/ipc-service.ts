import { ipcMain } from "electron";
import { DataSource } from "typeorm";
import { resolveDB } from "./database/connection";

let DB: DataSource;

async function getTables() {
  return await DB.query("select name from sqlite_master");
}

export default function registerIpcMain() {
  DB = resolveDB();

  ipcMain.handle("getTables", getTables);
}
