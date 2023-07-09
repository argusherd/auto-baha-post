import { app } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { revokeDB } from "./database/connection";
import { createWindow, initializeApp, serveProduction } from "./initialization";

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

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
app.on("before-quit", revokeDB);
