import Post from "@/backend-api/database/entities/Post";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import Publisher from "@/electron-src/components/PostPublisher";
import CrossProcessExports, { BrowserWindow } from "electron";
import pie from "puppeteer-in-electron";

jest.mock<typeof pie>("puppeteer-in-electron");
jest.mock<typeof CrossProcessExports>("electron", () => {
  const electron = jest.requireActual("electron");
  const mockedBrowserWindow = jest.fn(() => ({
    loadURL: jest.fn(),
    webContents: {
      executeJavaScript: jest.fn(),
    },
  }));

  return {
    ...electron,
    BrowserWindow: mockedBrowserWindow,
  };
});

describe("the publish deligator", () => {
  it("can check if the user is logged in", async () => {
    const publisher = new Publisher();

    pie.getPage = jest.fn().mockReturnValue({ $: jest.fn() });
    await publisher.init();

    expect(await publisher.isLogin()).toBeTruthy();
  });

  it("can check if the user is NOT logged in", async () => {
    const publisher = new Publisher();

    BrowserWindow.prototype.loadURL = jest.fn();
    pie.getPage = jest.fn().mockReturnValue({
      $: jest.fn().mockReturnValue(null),
    });

    await publisher.init();

    expect(await publisher.isLogin()).toBeFalsy();
  });

  it("can setup the window's local storage", async () => {
    const mockedExecuteJavaScript = jest.fn();
    const publisher = new Publisher();

    Object.defineProperty(BrowserWindow.prototype, "webContents", {
      value: {
        executeJavaScript: mockedExecuteJavaScript,
      },
    });

    await publisher.init();
    await publisher.setupLocalStorage();

    expect(mockedExecuteJavaScript).nthCalledWith(
      1,
      "localStorage.setItem('FOURM_TOUR_vote_apply', 'shown')"
    );
    expect(mockedExecuteJavaScript).nthCalledWith(
      2,
      "localStorage.setItem('FOURM_TOUR_comment', 'shown')"
    );
    expect(mockedExecuteJavaScript).nthCalledWith(
      3,
      "localStorage.setItem('FOURM_DEMONSTRATIO_HINT', 'shown')"
    );
  });

  it("can goto publish page", async () => {
    const mockedLoadUrl = jest.fn();
    const post = await new PostFactory().create();
    const publisher = new Publisher();

    BrowserWindow.prototype.loadURL = mockedLoadUrl;
    pie.getPage = jest.fn().mockReturnValue({ $: jest.fn() });
    publisher.post = post;

    await publisher.init();
    await publisher.toPublishPage();

    expect(mockedLoadUrl).toBeCalledWith(
      `https://forum.gamer.com.tw/post1.php?bsn=${post.board.no}&type=1`
    );
  });

  it("returns true if the publish page exists", async () => {
    const post = await new PostFactory().create();
    const publisher = new Publisher();

    pie.getPage = jest.fn().mockReturnValue({ $: jest.fn() });
    await publisher.init();
    publisher.post = post;

    expect(await publisher.toPublishPage()).toBeTruthy();
  });

  it("can fail the publishing", async () => {
    const mockedDestroy = jest.fn();
    const publisher = new Publisher();
    const post = await new PostFactory().create();

    BrowserWindow.prototype.destroy = mockedDestroy;
    publisher.post = post;
    await publisher.init();
    await publisher.fail("THE_FAILING_REASON");

    const failedPost = await Post.findOneBy({ id: post.id });

    expect(mockedDestroy).toBeCalled();
    expect(failedPost.publish_failed).toEqual("THE_FAILING_REASON");
  });
});
