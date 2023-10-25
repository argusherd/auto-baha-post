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
  mockedAxios.get = jest.fn().mockResolvedValue({
    data: {
      name: null,
      account: null,
      logged_in: true,
      created_at: null,
    },
  });

  it("has a button that has the ability to open the baha's page", async () => {
    const fakeOpenBaha = jest.fn();
    electronProperty.openBaha = fakeOpenBaha;

    Object.defineProperty(window, "electron", {
      value: electronProperty,
      configurable: true,
    });

    await waitFor(() => render(<Header />));

    const bahaBtn = screen.getByTestId("userinfo");

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

    expect(userInfo).toHaveTextContent("foo" + "bar");
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

    expect(userInfo).toHaveTextContent("Login");
  });

  it("shows the default avatar if the user is not logged in yet", async () => {
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

    expect(avatar).toHaveAttribute("src", "https://i2.bahamut.com.tw/none.gif");
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
      "https://avatar2.bahamut.com.tw/avataruserpic/b/a/bar/bar_s.png",
    );
  });
});
