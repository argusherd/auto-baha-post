import { ipcMain } from "electron";
import { createWindow } from "./initialization";

export default function registerIpcMain() {
  ipcMain.on("openBaha", openBaha);
}

async function openBaha() {
  const window = createWindow();

  await window.loadURL("https://home.gamer.com.tw/homeindex.php");
}
