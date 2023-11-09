import { BrowserWindow } from "electron";

import Login from "../../backend-api/database/entities/Login";
import InteractableWindow from "./InteractableWindow";

export default class LoginChecker extends InteractableWindow {
  public async run() {
    await this.init();

    if (await this.isLoggedIn()) {
      await this.openUserInfo();

      const { name, account } = await this.getUserInfo();

      await this.save(name, account);
    } else {
      await this.save();
    }

    this.window.destroy();
    this.sendEvent();
  }

  public async isLoggedIn() {
    await this.window.loadURL("https://forum.gamer.com.tw");

    const loggedIn = await this.page.$(".topbar_member-home");

    return loggedIn !== null;
  }

  public async openUserInfo() {
    await this.page.click(".fa-angle-down");

    await this.page.waitForSelector(".username");
  }

  public async getUserInfo() {
    const name = await this.page.$eval(".username", (el) => el.textContent);
    const account = await this.page.$eval(".userid", (el) => el.textContent);

    return { name, account };
  }

  public async save(name?: string, account?: string) {
    const login = new Login();

    login.name = name;
    login.account = account;
    login.logged_in = name != null;

    return await login.save();
  }

  public sendEvent() {
    const mainWindow = BrowserWindow.fromId(Number(process.env.MAIN_WINDOW_ID));

    mainWindow.webContents.send("loginStatusRefreshed");
  }
}
