import Post from "@/backend-api/database/entities/Post";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import Publisher from "@/electron-src/components/PostPublisher";
import { BrowserWindow, clipboard } from "electron";
import moment from "moment";
import pie from "puppeteer-in-electron";
import { resetElectronAndPie } from "../mock";

describe("the publish delegator", () => {
  beforeEach(() => {
    resetElectronAndPie();
  });

  it("can find one scheduled post", async () => {
    const publisher = new Publisher();

    await publisher.findScheduled();

    expect(publisher.post).toBeNull();

    const post = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await publisher.findScheduled();

    expect(publisher.post.id).toEqual(post.id);
  });

  it("can initialize the publish operator", async () => {
    const mockedConnect = jest.fn();
    const mockedGetPage = jest.fn();
    const publisher = new Publisher();

    pie.connect = mockedConnect;
    pie.getPage = mockedGetPage;
    await publisher.init();

    expect(mockedConnect).toBeCalled();
    expect(mockedGetPage).toBeCalled();
  });

  it("can check if the user is logged in", async () => {
    const publisher = new Publisher();

    await publisher.init();

    expect(await publisher.isLoggedIn()).toBeTruthy();
  });

  it("can check if the user is NOT logged in", async () => {
    const publisher = new Publisher();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    await publisher.init();

    expect(await publisher.isLoggedIn()).toBeFalsy();
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
    publisher.post = post;

    await publisher.init();
    await publisher.toPublishPage();

    expect(mockedLoadUrl).toBeCalledWith(
      `https://forum.gamer.com.tw/post1.php?bsn=${post.board.no}&type=1`
    );
  });

  it("can check if the publish page is exist", async () => {
    const post = await new PostFactory().create();
    const publisher = new Publisher();

    await publisher.init();
    publisher.post = post;

    expect(await publisher.toPublishPage()).toBeTruthy();
  });

  it("can check if the publish page is not exist", async () => {
    const post = await new PostFactory().create();
    const publisher = new Publisher();

    pie.getPage = jest
      .fn()
      .mockResolvedValue({ $: jest.fn().mockResolvedValue(null) });
    await publisher.init();
    publisher.post = post;

    expect(await publisher.toPublishPage()).toBeFalsy();
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

  it("can click away the load draft dialog", async () => {
    const mockedClick = jest.fn();
    const publisher = new Publisher();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(true),
      click: mockedClick,
      waitForSelector: jest.fn(),
    });

    await publisher.init();
    await publisher.clickAwayDialog();

    expect(mockedClick).toBeCalled();
  });

  it("can setup the post properties in the publish page", async () => {
    const mockedSelect = jest.fn();
    const mockedType = jest.fn();
    const publisher = new Publisher();
    const post = await new PostFactory().create({
      demonstratio: "1",
      sub_board: "2",
      subject: "3",
    });

    pie.getPage = jest.fn().mockResolvedValue({
      select: mockedSelect,
      type: mockedType,
    });

    publisher.post = post;
    await publisher.init();
    await publisher.setupProperties();

    expect(mockedSelect).nthCalledWith(
      1,
      "select[name='demonstratioType']",
      "1"
    );
    expect(mockedSelect).nthCalledWith(2, "select[name='nsubbsn']", "2");
    expect(mockedSelect).nthCalledWith(3, "select[name='subject']", "3");
    expect(mockedType).toBeCalledWith("input[name='title']", post.title);
  });

  it("can fallback the sub board property if the value is invalid", async () => {
    const mockedSelect = jest.fn();
    const publisher = new Publisher();
    const post = await new PostFactory().create({ sub_board: "99" });

    pie.getPage = jest.fn().mockResolvedValue({
      $eval: jest.fn().mockResolvedValue("0"),
      evaluate: jest.fn().mockResolvedValue("1"),
      select: mockedSelect,
    });

    publisher.post = post;
    await publisher.init();
    await publisher.fallbackSubBoard();

    expect(mockedSelect).toBeCalledWith("select[name='nsubbsn']", "1");
  });

  it("won't fallback if the sub board value is the same as the post", async () => {
    const mockedEvaludate = jest.fn();
    const mockedSelect = jest.fn();

    const publisher = new Publisher();
    const post = await new PostFactory().create({ sub_board: "2" });

    pie.getPage = jest.fn().mockResolvedValue({
      $eval: jest.fn().mockResolvedValue("2"),
      evaluate: mockedEvaludate,
      select: mockedSelect,
    });

    publisher.post = post;
    await publisher.init();
    await publisher.fallbackSubBoard();

    expect(mockedEvaludate).not.toBeCalled();
    expect(mockedSelect).not.toBeCalled();
  });

  it("can click the post tips image away", async () => {
    const publisher = new Publisher();
    const mockedClick = jest.fn();
    const mockedBoundingBox = jest.fn().mockResolvedValue({
      x: 100,
      y: 100,
    });
    const mocked$ = jest.fn().mockResolvedValue({
      boundingBox: mockedBoundingBox,
    });

    pie.getPage = jest.fn().mockResolvedValue({
      $: mocked$,
      click: mockedClick,
    });

    await publisher.init();
    await publisher.clickAwayPostTips();

    expect(mocked$).toBeCalledWith("#postTips");
    expect(mockedBoundingBox).toBeCalled();
    expect(mockedClick).toBeCalledWith("#postTips", {
      offset: {
        x: 100 + 50,
        y: 100 + 50,
      },
    });
  });

  it("can enter the content of the post", async () => {
    const mockedWriteText = jest.fn();
    const mockedPaste = jest.fn();
    const publisher = new Publisher();
    const post = await new PostFactory().create();

    clipboard.writeText = mockedWriteText;
    BrowserWindow.prototype.webContents.paste = mockedPaste;

    publisher.post = post;
    await publisher.init();
    await publisher.setupContent();

    expect(mockedWriteText).toBeCalledWith(post.content);
    expect(mockedPaste).toBeCalled();
  });

  it("can execute publish action", async () => {
    const mockedClick = jest.fn();
    const mockedWaitForSelector = jest.fn();
    const mockedWaitForNavigation = jest.fn().mockResolvedValue(true);
    const mockedDestroy = jest.fn();
    const publisher = new Publisher();
    const post = await new PostFactory().create();

    BrowserWindow.prototype.destroy = mockedDestroy;
    pie.getPage = jest.fn().mockResolvedValue({
      click: mockedClick,
      waitForSelector: mockedWaitForSelector,
      waitForNavigation: mockedWaitForNavigation,
    });

    publisher.post = post;
    await publisher.init();
    const result = await publisher.publish();

    const published = await Post.findOneBy({ id: post.id });

    expect(result).toBeTrue();
    expect(published.published_at).not.toBeNull();
    expect(mockedClick).toBeCalledWith(".BH-menu__post__btn");
    expect(mockedWaitForSelector).toBeCalledWith("button[type='submit']");
    expect(mockedClick).toBeCalledWith("button[type='submit']");
    expect(mockedWaitForNavigation).toBeCalled();
    expect(mockedDestroy).toBeCalled();
  });

  it("returns false if there was no navigation happened during the publishing action", async () => {
    const publisher = new Publisher();
    const post = await new PostFactory().create();

    pie.getPage = jest.fn().mockResolvedValue({
      click: jest.fn(),
      waitForSelector: jest.fn(),
      waitForNavigation: jest.fn().mockResolvedValue(null),
    });

    publisher.post = post;
    await publisher.init();
    const result = await publisher.publish();

    expect(result).toBeFalse();
  });

  it("can run the publishing process", async () => {
    const publisher = new Publisher();
    const post = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await publisher.run();

    const published = await Post.findOneBy({ id: post.id });

    expect(published.published_at).not.toBeNull();
    expect(published.publish_failed).toBeNull();
  });

  it("will not initiate the publish process if there is no scheduled post", async () => {
    const mockedInit = jest.fn();
    const publisher = new Publisher();

    Object.defineProperty(publisher, "init", {
      value: mockedInit,
    });

    await publisher.run();

    expect(mockedInit).not.toBeCalled();
  });

  it("fails the publishing if the user is not login", async () => {
    const publisher = new Publisher();
    const post = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperty(publisher, "isLoggedIn", {
      value: jest.fn().mockResolvedValue(false),
    });

    await publisher.run();

    const failed = await Post.findOneBy({ id: post.id });

    expect(failed.published_at).toBeNull();
    expect(failed.publish_failed).toEqual("USER_IS_NOT_LOGIN");
  });

  it("sets up the local storage during the publishing process", async () => {
    const mockedSetupLocalStorage = jest.fn();
    const publisher = new Publisher();

    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      setupLocalStorage: {
        value: mockedSetupLocalStorage,
      },
    });

    await publisher.run();

    expect(mockedSetupLocalStorage).toBeCalled();
  });

  it("fails the publishing if the publish page is incorrect", async () => {
    const publisher = new Publisher();
    const post = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperty(publisher, "isLoggedIn", {
      value: jest.fn().mockResolvedValue(true),
    });
    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    await publisher.run();

    const failed = await Post.findOneBy({ id: post.id });

    expect(failed.published_at).toBeNull();
    expect(failed.publish_failed).toEqual("BOARD_NOT_EXISTS");
  });

  it("sets up the post properties during the publishing process", async () => {
    const mockedSetupProperties = jest.fn();
    const publisher = new Publisher();

    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      setupProperties: {
        value: mockedSetupProperties,
      },
    });

    await publisher.run();

    expect(mockedSetupProperties).toBeCalled();
  });

  it("falls back the sub board during the publishing process", async () => {
    const mockedFallbackSubBoard = jest.fn();
    const publisher = new Publisher();

    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      fallbackSubBoard: {
        value: mockedFallbackSubBoard,
      },
    });

    await publisher.run();

    expect(mockedFallbackSubBoard).toBeCalled();
  });

  it("sets up the publish content during the publishing process", async () => {
    const mockedSetupContent = jest.fn();
    const publisher = new Publisher();

    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      setupContent: {
        value: mockedSetupContent,
      },
    });

    await publisher.run();

    expect(mockedSetupContent).toBeCalled();
  });

  it("clicks away the post tips image during the publishing process", async () => {
    const mockedClickAwayPostTips = jest.fn();
    const publisher = new Publisher();

    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      clickAwayPostTips: {
        value: mockedClickAwayPostTips,
      },
    });

    await publisher.run();

    expect(mockedClickAwayPostTips).toBeCalled();
  });

  it("executes the publishing process in a specified order", async () => {
    const mockedSetupProperties = jest.fn();
    const mockedFallbackSubBoard = jest.fn();
    const mockedClickAwayPostTips = jest.fn();
    const mockedSetupContent = jest.fn();
    const mockedPublish = jest.fn();
    const publisher = new Publisher();
    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    Object.defineProperties(publisher, {
      setupProperties: {
        value: mockedSetupProperties,
      },
      fallbackSubBoard: {
        value: mockedFallbackSubBoard,
      },
      clickAwayPostTips: {
        value: mockedClickAwayPostTips,
      },
      setupContent: {
        value: mockedSetupContent,
      },
      publish: {
        value: mockedPublish,
      },
    });

    await publisher.run();

    expect(mockedSetupProperties).toHaveBeenCalledBefore(
      mockedFallbackSubBoard
    );
    expect(mockedFallbackSubBoard).toHaveBeenCalledBefore(
      mockedClickAwayPostTips
    );
    expect(mockedClickAwayPostTips).toHaveBeenCalledBefore(mockedSetupContent);
    expect(mockedSetupContent).toHaveBeenCalledBefore(mockedPublish);
  });

  it("fails the publishing if the publish action returns false", async () => {
    const publisher = new Publisher();
    const post = await new PostFactory().create();

    Object.defineProperty(publisher, "publish", {
      value: jest.fn().mockResolvedValue(false),
    });

    publisher.post = post;
    await publisher.init();
    await publisher.run();

    const failed = await Post.findOneBy({ id: post.id });

    expect(failed.published_at).toBeNull();
    expect(failed.publish_failed).toEqual("UNABLE_TO_PUBLISH");
  });
});
