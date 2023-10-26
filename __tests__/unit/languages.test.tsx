import i18n from "@/i18n";
import Languages from "@/renderer/app/languages";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";

describe("language switcher", () => {
  beforeEach(() => {
    render(<Languages />);
  });

  it("can toggle the language list by hovering on the component", async () => {
    const icon = screen.getByRole("button");
    let languages = screen.queryByRole("list");

    expect(languages).not.toBeInTheDocument();

    await userEvent.hover(icon);

    languages = screen.queryByRole("list");

    expect(languages).toBeInTheDocument();
  });

  it("lists all available languages", async () => {
    const icon = screen.getByRole("button");

    await userEvent.hover(icon);

    const languages = screen.getAllByRole("listitem");

    expect(languages).toHaveLength(2);
    expect(languages[0]).toHaveTextContent("English");
    expect(languages[1]).toHaveTextContent("正體中文");
  });

  it("can set which language to use", async () => {
    const icon = screen.getByRole("button");

    expect(i18n.language).toEqual("en");
    expect(moment.locale()).toEqual("en");

    await userEvent.hover(icon);

    const traditionalChinese = screen.getAllByRole("listitem")[1];

    await userEvent.click(traditionalChinese);

    expect(i18n.language).toEqual("zh-tw");
    expect(moment.locale()).toEqual("zh-tw");
  });
});
