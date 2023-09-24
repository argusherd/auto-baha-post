import { app, BrowserWindow } from "electron";
import puppeteer, { Browser, Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import Post from "../../backend-api/database/entities/Post";

export default class Publisher {
  browser: Browser;
  window: BrowserWindow;
  page: Page;
  post: Post;

  public async init() {
    this.browser = await pie.connect(app, puppeteer as any);
    this.window = new BrowserWindow();
    this.page = await pie.getPage(this.browser, this.window);
  }

  public async isLogin() {
    await this.window.loadURL("https://forum.gamer.com.tw");

    const loggedIn = await this.page.$(".topbar_member-home");

    return loggedIn !== null;
  }

  public async setupLocalStorage() {
    await this.window.webContents.executeJavaScript(
      "localStorage.setItem('FOURM_TOUR_vote_apply', 'shown')"
    );
    await this.window.webContents.executeJavaScript(
      "localStorage.setItem('FOURM_TOUR_comment', 'shown')"
    );
    await this.window.webContents.executeJavaScript(
      "localStorage.setItem('FOURM_DEMONSTRATIO_HINT', 'shown')"
    );
  }

  public async toPublishPage() {
    await this.window.loadURL(
      `https://forum.gamer.com.tw/post1.php?bsn=${this.post.board.no}&type=1`
    );

    const publishPage = await this.page.$(".c-post__header");

    console.log(publishPage);

    return publishPage !== null;
  }

  public async fail(reason: string) {
    this.post.publish_failed = reason;

    await this.post.save();

    this.window.destroy();
  }
}
