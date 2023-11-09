import { app, BrowserWindow } from "electron";
import puppeteer, { Browser, Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";

export default class InteractableWindow {
  browser: Browser;
  window: BrowserWindow;
  page: Page;

  public async init() {
    this.browser = await pie.connect(app, puppeteer as any);
    this.window = new BrowserWindow({
      show: Boolean(parseInt(process.env.DEBUG as string, 10)),
    });
    this.page = await pie.getPage(this.browser, this.window);
  }
}
