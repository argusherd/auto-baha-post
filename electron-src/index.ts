import { app, BrowserWindow, dialog } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { revokeDB } from "../backend-api/database/connection";
import { closeServer } from "../backend-api/server";
import i18n from "../i18n";
import { createWindow, initializeApp, serveProduction } from "./initialization";
import scheduler from "./scheduler";

const loadURL = serveProduction();

let mainWindow: BrowserWindow;

initializeApp();

autoUpdater.autoDownload = false;

if (isDev) {
  autoUpdater.updateConfigPath = join(process.cwd(), "dev-app-update.yml");
  autoUpdater.forceDevUpdateConfig = true;
}

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  mainWindow = createWindow();

  process.env.MAIN_WINDOW_ID = `${mainWindow.id}`;

  if (parseInt(process.env.DEBUG as string, 10)) {
    mainWindow.webContents.openDevTools();
  }

  if (isDev) {
    mainWindow.loadURL("http://localhost:8000/");
  } else {
    await loadURL(mainWindow);
  }
});

app.on("before-quit", async () => {
  scheduler.stop();
  closeServer();
  await revokeDB();
});

app.on("window-all-closed", app.quit);

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("updateAvailable");
});

autoUpdater.on("update-not-available", () => {
  mainWindow.webContents.send("updateNotAvailable");
});

autoUpdater.on("download-progress", (info) => {
  mainWindow.webContents.send("downloadProgress", info.percent);
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      buttons: [],
      message: i18n.t("update.downloaded"),
    })
    .then(() => autoUpdater.quitAndInstall());
});

autoUpdater.on("error", (error) => {
  mainWindow.webContents.send("updateError", error.message);
});
