import { resolveDB } from "@/backend-api/database/connection";
import CrossProcessExports from "electron";
import * as matchers from "jest-extended";
import pie from "puppeteer-in-electron";
import { DataSource } from "typeorm";

let DB: DataSource;

expect.extend(matchers);

jest.mock<typeof pie>("puppeteer-in-electron");
jest.mock<typeof CrossProcessExports>("electron", () => {
  const electron = jest.requireActual("electron");
  const mockedBrowserWindow = jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    webContents: {
      executeJavaScript: jest.fn(),
    },
  }));

  return {
    ...electron,
    BrowserWindow: mockedBrowserWindow,
    clipboard: jest.fn(),
  };
});

beforeEach(async () => {
  DB = resolveDB();
  await DB.initialize();
  await DB.runMigrations();
});

afterEach(async () => {
  await DB.destroy();
  jest.resetAllMocks();
});
