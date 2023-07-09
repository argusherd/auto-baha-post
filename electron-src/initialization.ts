import { configDotenv } from "dotenv";
import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import { constants, copyFile } from "fs/promises";
import { join } from "path";
import { resolveDB } from "./database/connection";
import registerIpcMain from "./ipc-service";

export function serveProduction() {
  return serve({
    directory: join(
      isDev || process.env.NODE_ENV == "test"
        ? process.cwd()
        : app.getAppPath(),
      "./renderer/out"
    ),
  });
}

export function initializeApp() {
  const envFilePath = join(process.cwd(), ".env");
  const productionEnvFile = envFilePath + ".production.example";

  copyFile(productionEnvFile, envFilePath, constants.COPYFILE_EXCL)
    .catch(() => {})
    .then(() => {
      configDotenv();

      resolveDB().initialize();

      registerIpcMain();
    });
}

export function createWindow() {
  return new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, "preload.js"),
    },
  });
}
