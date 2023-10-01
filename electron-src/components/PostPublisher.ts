import { app, BrowserWindow, clipboard } from "electron";
import moment from "moment";
import puppeteer, { Browser, Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import { Between } from "typeorm";
import Post from "../../backend-api/database/entities/Post";

export default class PostPublisher {
  browser: Browser;
  window: BrowserWindow;
  page: Page;
  post: Post;

  public async findScheduled() {
    const format = "YYYY-MM-DD HH:mm:ss.SSS";
    const datetime = moment().utc();

    return (this.post = await Post.findOne({
      where: {
        scheduled_at: Between(
          datetime.startOf("minute").format(format),
          datetime.endOf("minute").format(format)
        ),
      },
      relations: {
        board: true,
      },
    }));
  }

  public async run() {
    this.post = this.post || (await this.findScheduled());

    if (!this.post) return;

    await this.init();

    if (!(await this.isLogin())) return await this.fail("USER_IS_NOT_LOGIN");

    await this.setupLocalStorage();

    if (!(await this.toPublishPage()))
      return await this.fail("BOARD_NOT_EXISTS");

    await this.setupProperties();
    await this.fallbackSubBoard();
    await this.clickAwayPostTips();
    await this.setupContent();
    await this.publish();
  }

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

    return publishPage !== null;
  }

  public async fail(reason: string) {
    this.post.publish_failed = reason;

    await this.post.save();

    this.window.destroy();
  }

  public async setupProperties() {
    await this.page.select(
      "select[name='demonstratioType']",
      String(this.post.demonstratio)
    );
    await this.page.select(
      "select[name='nsubbsn']",
      String(this.post.sub_board)
    );
    await this.page.select("select[name='subject']", String(this.post.subject));
    await this.page.type("input[name='title']", this.post.title);
  }

  public async fallbackSubBoard() {
    const pickedValue = await this.page.$eval(
      "select[name='nsubbsn']",
      (subBoard) => subBoard.value
    );

    if (pickedValue === String(this.post.sub_board)) {
      return;
    }

    const fallbackValue = await this.page.evaluate(() => {
      const options = document.querySelectorAll(
        "select[name='nsubbsn'] > option"
      );

      for (let el of options.values()) {
        const value = el.getAttribute("value");
        const text = el.textContent;

        if (value !== "0" && !text.includes("已鎖定")) return value;
      }
    });

    await this.page.select("select[name='nsubbsn']", fallbackValue);
  }

  public async clickAwayPostTips() {
    const postTips = await this.page.$("#postTips");

    const position = await postTips.boundingBox();

    await this.page.click("#postTips", {
      offset: { x: position.x + 50, y: position.y + 50 },
    });
  }

  public async setupContent() {
    clipboard.writeText(this.post.content);

    this.window.webContents.paste();
  }

  public async publish() {
    await this.page.click(".BH-menu__post__btn");

    await this.page.waitForSelector("button[type='submit']");

    await this.page.click("button[type='submit']");

    await this.page.waitForNavigation();

    this.post.published_at = moment().toISOString();

    await this.post.save();

    this.window.destroy();
  }
}
