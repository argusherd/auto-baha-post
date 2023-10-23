import Header from "@/renderer/app/header";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { mockedAxios } from "./setup/mock";

describe("the navbar", () => {
  const electronProperty = {
    openBaha: jest.fn(),
    refreshLoginStatus: jest.fn(),
  };

  userEvent.setup();

  it("has a button that has the ability to open the baha login page", async () => {
    const fakeOpenBaha = jest.fn();
    electronProperty.openBaha = fakeOpenBaha;

    Object.defineProperty(window, "electron", {
      value: electronProperty,
      configurable: true,
    });

    render(<Header />);

    const bahaBtn = await screen.findByRole("button", { name: "Open Baha" });

    expect(bahaBtn).toBeInTheDocument();

    await userEvent.click(bahaBtn);

    expect(fakeOpenBaha).toBeCalled();
  });

  it("can indicate the user is logged in successfully", async () => {
    const created_at = moment().toISOString();
    mockedAxios.get = jest.fn().mockResolvedValue({
      data: {
        name: "foo",
        account: "bar",
        logged_in: true,
        created_at,
      },
    });

    await waitFor(() => render(<Header />));

    const userInfo = screen.getByTestId("userinfo");

    expect(userInfo).toHaveTextContent("foo (bar)");
    expect(userInfo).toHaveAttribute("title");
  });

  it("can indicate the user is not logged in yet", async () => {
    mockedAxios.get = jest.fn().mockResolvedValue({
      data: {
        name: null,
        account: null,
        logged_in: false,
        created_at: moment().toISOString(),
      },
    });

    await waitFor(() => render(<Header />));

    const userInfo = screen.getByTestId("userinfo");

    expect(userInfo).toHaveTextContent("User is not logged in yet");
  });

  it("does not show avatar if the user is not logged in yet", async () => {
    mockedAxios.get = jest.fn().mockResolvedValue({
      data: {
        name: null,
        account: null,
        logged_in: false,
        created_at: moment().toISOString(),
      },
    });

    await waitFor(() => render(<Header />));

    const avatar = screen.queryByRole("img");

    expect(avatar).not.toBeInTheDocument();
  });

  it("shows avatar if the user is logged in", async () => {
    mockedAxios.get = jest.fn().mockResolvedValue({
      data: {
        name: "foo",
        account: "bar",
        logged_in: true,
        created_at: moment().toISOString(),
      },
    });

    await waitFor(() => render(<Header />));

    const avatar = screen.getByRole("img");

    expect(avatar).toHaveAttribute(
      "src",
      "https://avatar2.bahamut.com.tw/avataruserpic/b/a/bar/bar_s.png"
    );
  });
});
