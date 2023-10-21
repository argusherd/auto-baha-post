import BahaEmojis from "@/renderer/app/posts/_posts/baha-emojis";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("the baha emoji component", () => {
  it("lists all available baha-emoji", async () => {
    render(<BahaEmojis insertEmoji={() => {}} />);

    const emojis = screen.getAllByRole("img");

    expect(emojis).toHaveLength(43);
    expect(emojis[0]).toHaveAttribute(
      "src",
      "https://i2.bahamut.com.tw/editor/emotion/1.gif"
    );
    expect(emojis[42]).toHaveAttribute(
      "src",
      "https://i2.bahamut.com.tw/editor/emotion/43.gif"
    );
  });

  it("can trigger a parent method when click on one of the images", async () => {
    const mockedFunction = jest.fn();

    render(<BahaEmojis insertEmoji={mockedFunction} />);

    const emoji = screen.getAllByRole("img")[0];

    await userEvent.click(emoji);

    expect(mockedFunction).toBeCalledWith(
      "https://i2.bahamut.com.tw/editor/emotion/1.gif"
    );
  });
});
