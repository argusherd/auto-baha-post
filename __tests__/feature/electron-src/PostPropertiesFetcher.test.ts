import Demonstratio from "@/backend-api/database/entities/Demonstratio";
import SubBoard from "@/backend-api/database/entities/SubBoard";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import DemonstratioFactory from "@/backend-api/database/factories/DemonstratioFactory";
import SubBoardFactory from "@/backend-api/database/factories/SubBoardFactory";
import Fetcher from "@/electron-src/components/PostPropertiesFetcher";
import { BrowserWindow } from "electron";
import pie from "puppeteer-in-electron";
import { resetElectronAndPie } from "../mock";

describe("the post properties fetcher", () => {
  beforeEach(() => {
    resetElectronAndPie();
  });

  it("can initialize the page to fetch the post properties", async () => {
    const mockedConnect = jest.fn();
    const mockedGetPage = jest.fn();
    const fetcher = new Fetcher();

    pie.connect = mockedConnect;
    pie.getPage = mockedGetPage;

    await fetcher.init();

    expect(mockedConnect).toBeCalled();
    expect(mockedGetPage).toBeCalled();
  });

  it("can check the given board is available", async () => {
    const fetcher = new Fetcher();

    fetcher.board = await new BoardFactory().create();
    BrowserWindow.prototype.loadURL = jest.fn();
    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(true),
    });

    await fetcher.init();

    expect(await fetcher.isAvailable()).toBeTrue();
  });

  it("can check the given board is not available", async () => {
    const fetcher = new Fetcher();

    fetcher.board = await new BoardFactory().create();
    BrowserWindow.prototype.loadURL = jest.fn();
    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    await fetcher.init();

    expect(await fetcher.isAvailable()).toBeFalse();
  });

  it("is not available if there is no board provided", async () => {
    const fetcher = new Fetcher();

    expect(fetcher.board).toBeUndefined();
    expect(await fetcher.isAvailable()).toBeFalse();
  });

  it("can save all demonstratios into database", async () => {
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();

    pie.getPage = jest.fn().mockResolvedValue({
      $$: jest.fn().mockResolvedValue([
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("12"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("foo"),
            }),
        },
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("34"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("bar"),
            }),
        },
      ]),
    });

    fetcher.board = board;
    await fetcher.init();
    await fetcher.save(Demonstratio);

    const saved = await Demonstratio.findBy({ id: null });

    expect(saved).toHaveLength(2);
    expect(saved[0].board_id).toEqual(board.id);
    expect(saved[0].value).toEqual("12");
    expect(saved[0].text).toEqual("foo");
    expect(saved[1].board_id).toEqual(board.id);
    expect(saved[1].value).toEqual("34");
    expect(saved[1].text).toEqual("bar");
  });

  it("removes all existing demonstratios before saving the new result", async () => {
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();
    await new DemonstratioFactory().createMany(2, { board });

    pie.getPage = jest.fn().mockResolvedValue({
      $$: jest.fn().mockResolvedValue([
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("12"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("foo"),
            }),
        },
      ]),
    });

    expect(await Demonstratio.count()).toEqual(2);

    fetcher.board = board;
    await fetcher.init();
    await fetcher.save(Demonstratio);

    const saved = await Demonstratio.findBy({ id: null });

    expect(await Demonstratio.count()).toEqual(1);
    expect(saved[0].board_id).toEqual(board.id);
    expect(saved[0].value).toEqual("12");
    expect(saved[0].text).toEqual("foo");
  });

  it("can save all sub boards into database", async () => {
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();

    pie.getPage = jest.fn().mockResolvedValue({
      $$: jest.fn().mockResolvedValue([
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("12"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("foo"),
            }),
        },
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("34"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("bar"),
            }),
        },
      ]),
    });

    fetcher.board = board;
    await fetcher.init();
    await fetcher.save(SubBoard);

    const saved = await SubBoard.findBy({ id: null });

    expect(saved).toHaveLength(2);
    expect(saved[0].board_id).toEqual(board.id);
    expect(saved[0].value).toEqual("12");
    expect(saved[0].text).toEqual("foo");
    expect(saved[1].board_id).toEqual(board.id);
    expect(saved[1].value).toEqual("34");
    expect(saved[1].text).toEqual("bar");
  });

  it("removes all existing sub boards before saving the new result", async () => {
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();
    await new SubBoardFactory().createMany(2, { board });

    pie.getPage = jest.fn().mockResolvedValue({
      $$: jest.fn().mockResolvedValue([
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("12"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("foo"),
            }),
        },
      ]),
    });

    expect(await SubBoard.count()).toEqual(2);

    fetcher.board = board;
    await fetcher.init();
    await fetcher.save(SubBoard);

    const saved = await SubBoard.findBy({ id: null });

    expect(await SubBoard.count()).toEqual(1);
    expect(saved[0].board_id).toEqual(board.id);
    expect(saved[0].value).toEqual("12");
    expect(saved[0].text).toEqual("foo");
  });

  it("can run the processing to save all the demonstratios and all the sub boards", async () => {
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn(),
      $$: jest.fn().mockResolvedValue([
        {
          getProperty: jest
            .fn()
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("12"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("foo"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("34"),
            })
            .mockResolvedValueOnce({
              jsonValue: jest.fn().mockResolvedValue("bar"),
            }),
        },
      ]),
    });

    fetcher.board = board;
    await fetcher.run();

    const demonstratio = await Demonstratio.findOneBy({ id: null });
    const subBoard = await SubBoard.findOneBy({ id: null });

    expect(demonstratio.value).toEqual("12");
    expect(demonstratio.text).toEqual("foo");
    expect(subBoard.value).toEqual("34");
    expect(subBoard.text).toEqual("bar");
  });

  it("won't run the processing if the board is not available", async () => {
    const mockedSave = jest.fn();
    const fetcher = new Fetcher();
    const board = await new BoardFactory().create();

    pie.getPage = jest.fn().mockResolvedValue({
      $: jest.fn().mockResolvedValue(null),
    });

    Object.defineProperty(fetcher, "save", {
      value: mockedSave,
    });

    fetcher.board = board;
    await fetcher.run();

    expect(mockedSave).not.toBeCalled();
    expect(await Demonstratio.count()).toEqual(0);
    expect(await SubBoard.count()).toEqual(0);
  });

  it("destroy the window after running the processing", async () => {
    const mockedDestroy = jest.fn();
    const fetcher = new Fetcher();

    BrowserWindow.prototype.destroy = mockedDestroy;

    await fetcher.run();

    expect(mockedDestroy).toBeCalled();
  });
});
