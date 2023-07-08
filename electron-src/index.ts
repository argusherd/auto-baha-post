import { configDotenv } from "dotenv";
import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import serve from "electron-serve";
import { access, constants, copyFile } from "fs/promises";
import { join } from "path";
import { DataSource } from "typeorm";
import createConnection from "./database/connection";

const envFilePath = join(process.cwd(), ".env");
const loadURL = serve({
  directory: join(
    isDev || process.env.NODE_ENV == "test" ? process.cwd() : app.getAppPath(),
    "./renderer/out"
  ),
});

let DB: DataSource;

access(envFilePath)
  .catch(() =>
    copyFile(
      envFilePath + ".production.example",
      envFilePath,
      constants.COPYFILE_EXCL
    )
  )
  .then(async () => {
    configDotenv();

    DB = createConnection();
    await DB.initialize();
    await DB.runMigrations();
  });

ipcMain.handle(
  "getTables",
  async () => await DB.query("select name from sqlite_master")
);

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (parseInt(process.env.DEBUG as string, 10)) {
    mainWindow.webContents.openDevTools();
  }

  if (isDev) {
    mainWindow.loadURL("http://localhost:8000/");
  } else {
    await loadURL(mainWindow);
  }
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
app.on("before-quit", async () => await DB.destroy());
