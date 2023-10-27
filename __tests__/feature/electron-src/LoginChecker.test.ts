import Login from "@/backend-api/database/entities/Login";
import LoginChecker from "@/electron-src/components/LoginChecker";
import { BrowserWindow } from "electron";
import pie from "puppeteer-in-electron";
import { resetElectronAndPie } from "../mock";

describe("check baha login status", () => {
  beforeEach(() => {
    resetElectronAndPie();
  });

  it("can initialize the check operator", async () => {
    const mockedConnect = jest.fn();
    const mockedGetPage = jest.fn();
    const checker = new LoginChecker();

    pie.connect = mockedConnect;
    pie.getPage = mockedGetPage;

    await checker.init();

    expect(mockedConnect).toBeCalled();
    expect(mockedGetPage).toBeCalled();
  });

  it("opens the baha page to check the user is logged in or not", async () => {
    const mockedLoadUrl = jest.fn();
    const checker = new LoginChecker();

    BrowserWindow.prototype.loadURL = mockedLoadUrl;

    await checker.init();
    await checker.isLoggedIn();

    expect(mockedLoadUrl).toBeCalledWith("https://forum.gamer.com.tw");
  });

  it("can indicate that the user is logged in", async () => {
    const checker = new LoginChecker();

    await checker.init();

    expect(await checker.isLoggedIn()).toBeTrue();
  });

  it("can indicate that the user is not logged in yet", async () => {
    const checker = new LoginChecker();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    await checker.init();

    expect(await checker.isLoggedIn()).toBeFalse();
  });

  it("can open the user info popover", async () => {
    const mockedClick = jest.fn();
    const mockedWaitForSelector = jest.fn();
    const checker = new LoginChecker();

    pie.getPage = jest.fn().mockResolvedValue({
      click: mockedClick,
      waitForSelector: mockedWaitForSelector,
    });

    await checker.init();
    await checker.openUserInfo();

    expect(mockedClick).toBeCalledWith(".fa-angle-down");
    expect(mockedWaitForSelector).toBeCalledWith(".username");
  });

  it("can collect user info", async () => {
    const checker = new LoginChecker();

    pie.getPage = jest.fn().mockResolvedValue({
      $eval: jest
        .fn()
        .mockResolvedValueOnce("foo")
        .mockResolvedValueOnce("bar"),
    });

    await checker.init();

    expect(await checker.getUserInfo()).toMatchObject({
      name: "foo",
      account: "bar",
    });
  });

  it("keeps a record to indicate whether the user is logged in or not since last check", async () => {
    const checker = new LoginChecker();

    await checker.init();

    const loggedIn = await checker.save("foo", "bar");
    const notLoggedIn = await checker.save();

    expect(loggedIn.name).toEqual("foo");
    expect(loggedIn.account).toEqual("bar");
    expect(loggedIn.logged_in).toBeTrue();

    expect(notLoggedIn.name).toBeNull();
    expect(notLoggedIn.account).toBeNull();
    expect(notLoggedIn.logged_in).toBeFalse();
  });

  it("sends an event to the main window to tell the frontend refresh the login status", async () => {
    const mockedSend = jest.fn();
    const checker = new LoginChecker();

    BrowserWindow.fromId = jest.fn().mockReturnValue({
      webContents: {
        send: mockedSend,
      },
    });

    checker.sendEvent();

    expect(mockedSend).toBeCalledWith("loginStatusRefreshed");
  });

  it("can run the process to keep a record to indicate the user is logged in", async () => {
    const checker = new LoginChecker();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn(),
      click: jest.fn(),
      waitForSelector: jest.fn(),
      $eval: jest
        .fn()
        .mockResolvedValueOnce("foo")
        .mockResolvedValueOnce("bar"),
    });

    await checker.run();

    const loggedIn = await Login.findOneBy({ id: null });

    expect(loggedIn.name).toEqual("foo");
    expect(loggedIn.account).toEqual("bar");
    expect(loggedIn.logged_in).toBeTrue();
  });

  it("can run the process to keep a record to indicate the user is not logged in yet", async () => {
    const checker = new LoginChecker();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    await checker.run();

    const notLoggedIn = await Login.findOneBy({ id: null });

    expect(notLoggedIn.name).toBeNull();
    expect(notLoggedIn.account).toBeNull();
    expect(notLoggedIn.logged_in).toBeFalse();
  });

  it("destroys the window after running the process", async () => {
    const mockedDestroy = jest.fn();
    const checker = new LoginChecker();

    BrowserWindow.prototype.destroy = mockedDestroy;

    await checker.run();

    expect(mockedDestroy).toBeCalled();
  });

  it("runs the process in a specified order", async () => {
    const mockedInit = jest.fn();
    const mockedIsLoggedIn = jest.fn().mockResolvedValue(true);
    const mockedOpenUserInfo = jest.fn();
    const mockedGetUserInfo = jest
      .fn()
      .mockResolvedValue({ name: "foo", account: "bar" });
    const mockedSave = jest.fn();
    const mockedSendEvent = jest.fn();
    const checker = new LoginChecker();

    Object.defineProperty(checker, "init", { value: mockedInit });
    Object.defineProperty(checker, "isLoggedIn", { value: mockedIsLoggedIn });
    Object.defineProperty(checker, "openUserInfo", {
      value: mockedOpenUserInfo,
    });
    Object.defineProperty(checker, "getUserInfo", { value: mockedGetUserInfo });
    Object.defineProperty(checker, "save", { value: mockedSave });
    Object.defineProperty(checker, "window", { value: { destroy: jest.fn() } });
    Object.defineProperty(checker, "sendEvent", { value: mockedSendEvent });

    await checker.run();

    expect(mockedInit).toHaveBeenCalledBefore(mockedIsLoggedIn);
    expect(mockedIsLoggedIn).toHaveBeenCalledBefore(mockedOpenUserInfo);
    expect(mockedOpenUserInfo).toHaveBeenCalledBefore(mockedGetUserInfo);
    expect(mockedGetUserInfo).toHaveBeenCalledBefore(mockedSave);
    expect(mockedSave).toHaveBeenCalledBefore(mockedSendEvent);
    expect(mockedSave).toBeCalledWith("foo", "bar");
  });
});
