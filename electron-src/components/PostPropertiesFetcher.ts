import { app, BrowserWindow } from "electron";
import puppeteer, { Browser, Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import Board from "../../backend-api/database/entities/Board";
import Demonstratio from "../../backend-api/database/entities/Demonstratio";
import SubBoard from "../../backend-api/database/entities/SubBoard";

interface InputNames {
  Demonstratio: string;
  SubBoard: string;
}

export default class PostPropertiesFetcher {
  browser: Browser;
  window: BrowserWindow;
  page: Page;
  board: Board;

  inputNames: InputNames = {
    Demonstratio: "demonstratioType",
    SubBoard: "nsubbsn",
  };

  public async run() {
    await this.init();

    if (await this.isAvailable()) {
      await this.save(Demonstratio);
      await this.save(SubBoard);
    }

    this.window.destroy();
  }

  public async init() {
    this.browser = await pie.connect(app, puppeteer as any);
    this.window = new BrowserWindow();
    this.page = await pie.getPage(this.browser, this.window);
  }

  public async isAvailable() {
    if (!this.board) return false;

    await this.window.loadURL(
      `https://forum.gamer.com.tw/post1.php?bsn=${this.board.no}&type=1`
    );

    const publishPage = await this.page.$(".c-post__header");

    return publishPage !== null;
  }

  public async save(entity: typeof Demonstratio | typeof SubBoard) {
    let options = await this.page.$$(
      `select[name='${(this.inputNames as any)[entity.name]}'] > option`
    );

    if (options.length) await entity.delete({ board_id: this.board.id });

    for (let option of options) {
      let value = await option.getProperty("value");
      let text = await option.getProperty("textContent");

      const newRecord = new entity();
      newRecord.board_id = this.board.id;
      newRecord.value = value.toString();
      newRecord.text = text.toString();
      await newRecord.save();
    }
  }
}
