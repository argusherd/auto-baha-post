import { app } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { revokeDB } from "../backend-api/database/connection";
import backendServer from "../backend-api/server";
import { createWindow, initializeApp, serveProduction } from "./initialization";
import scheduler from "./scheduler";

const loadURL = serveProduction();

initializeApp();

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = createWindow();

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
  backendServer.close();
  await revokeDB();
});

app.on("window-all-closed", app.quit);
