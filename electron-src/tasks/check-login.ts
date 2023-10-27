import { app, BrowserWindow } from "electron";
import { AsyncTask } from "toad-scheduler";
import LoginChecker from "../components/LoginChecker";

const checkLogin = new AsyncTask("check login status", async () => {
  await waitUntilAppFullyReady();
  const loginChecker = new LoginChecker();
  await loginChecker.run();
});

/**
 * Wait until the Electron is initialized AND the main window is ready.
 * Prevent the "window-all-closed" event from being triggered.
 */
async function waitUntilAppFullyReady() {
  await app.whenReady();

  while (BrowserWindow.getAllWindows().length < 1) {
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
  }
}

export default checkLogin;
