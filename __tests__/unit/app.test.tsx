import Home from "@/renderer/app/page";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

let originalElectron = window.Electron;

beforeAll(() => {
  Object.defineProperty(window, "electron", {
    value: { getTables: jest.fn().mockReturnValue([{ name: "migrations" }]) },
    configurable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, "electron", {
    value: originalElectron,
    configurable: true,
  });
});

test("it will say hi to us", async () => {
  const { findByRole } = render(<Home />);

  const content = await findByRole("heading");

  expect(content).toHaveTextContent("Hi");
});

test("it can list all tables in the database", async () => {
  const { findByRole } = render(<Home />);

  const content = await findByRole("listitem");

  expect(content).toHaveTextContent("migrations");
});
