import { app, BrowserWindow } from "electron";
import puppeteer, { Browser, Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import Login from "../../backend-api/database/entities/Login";

export default class LoginChecker {
  browser: Browser;
  window: BrowserWindow;
  page: Page;

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
  }

  public async init() {
    this.browser = await pie.connect(app, puppeteer as any);
    this.window = new BrowserWindow();
    this.page = await pie.getPage(this.browser, this.window);
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
}
