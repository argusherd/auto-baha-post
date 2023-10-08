import { BrowserWindow } from "electron";
import pie from "puppeteer-in-electron";

export const resetElectronAndPie = () => {
  BrowserWindow.prototype.loadURL = jest.fn();
  BrowserWindow.prototype.destroy = jest.fn();

  pie.getPage = jest.fn().mockResolvedValue({
    $: jest.fn().mockResolvedValue({
      boundingBox: jest.fn().mockResolvedValue({ x: 0, y: 0 }),
    }),
    $eval: jest.fn(),
    click: jest.fn(),
    evaluate: jest.fn(),
    select: jest.fn(),
    type: jest.fn(),
    waitForSelector: jest.fn(),
    waitForNavigation: jest.fn().mockResolvedValue(true),
  });
};
