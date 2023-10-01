import { backendUrl } from "./mock";

jest.mock("axios");
jest.mock("next/navigation");

Object.defineProperty(window, "backendUrl", {
  configurable: true,
  value: backendUrl,
  writable: true,
});

Object.defineProperty(window, "electron", {
  configurable: true,
  value: {},
  writable: true,
});

afterEach(() => {
  jest.clearAllMocks();
});
