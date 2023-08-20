import Header from "@/renderer/app/header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("the navbar", () => {
  const fakeOpenBaha = jest.fn();
  userEvent.setup();

  Object.defineProperty(window, "electron", {
    value: { openBaha: fakeOpenBaha },
  });

  beforeEach(() => {
    render(<Header />);
  });

  it("has a button that has the ability to open the baha login page", async () => {
    const bahaBtn = await screen.findByRole("button", { name: "Open Baha" });

    expect(bahaBtn).toBeInTheDocument();

    await userEvent.click(bahaBtn);

    expect(fakeOpenBaha).toBeCalled();
  });
});
