// Native
import { join } from "path";

// Packages
import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import serve from "electron-serve";

const loadURL = serve({ directory: "./renderer/out" });

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL("http://localhost:8000/");
  } else {
    loadURL(mainWindow);
  }
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
