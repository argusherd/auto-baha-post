import BahaEmojis from "@/renderer/app/posts/_posts/baha-emojis";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("the baha emoji component", () => {
  it("can open the emoji list by hovering the button", async () => {
    render(<BahaEmojis insertEmoji={() => {}} />);

    expect(screen.queryAllByRole("img")).toHaveLength(0);

    await userEvent.hover(screen.getByRole("button"));

    expect(screen.getAllByRole("img")).toHaveLength(43);
  });

  it("closes the emoji list by leave the mouse from the list itself", async () => {
    render(<BahaEmojis insertEmoji={() => {}} />);

    await userEvent.hover(screen.getByRole("button"));

    await userEvent.unhover(screen.getByTestId("emojis"));

    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("lists all available baha-emoji", async () => {
    render(<BahaEmojis insertEmoji={() => {}} />);

    await userEvent.hover(screen.getByRole("button"));

    const emojis = screen.getAllByRole("img");

    expect(emojis).toHaveLength(43);
    expect(emojis[0]).toHaveAttribute(
      "src",
      "https://i2.bahamut.com.tw/editor/emotion/1.gif",
    );
    expect(emojis[42]).toHaveAttribute(
      "src",
      "https://i2.bahamut.com.tw/editor/emotion/43.gif",
    );
  });

  it("can trigger a parent method when click on one of the images", async () => {
    const mockedFunction = jest.fn();

    render(<BahaEmojis insertEmoji={mockedFunction} />);

    await userEvent.hover(screen.getByRole("button"));

    const emoji = screen.getAllByRole("img")[0];

    await userEvent.click(emoji);

    expect(mockedFunction).toBeCalledWith(
      "https://i2.bahamut.com.tw/editor/emotion/1.gif",
    );
  });
});
