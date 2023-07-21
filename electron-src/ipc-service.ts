import { ipcMain } from "electron";
import { DataSource } from "typeorm";
import { resolveDB } from "../backend-api/database/connection";

let DB: DataSource;

export default function registerIpcMain() {
  DB = resolveDB();

  ipcMain.handle("getTables", getTables);
}

async function getTables() {
  return await DB.query("select name from sqlite_master");
}
