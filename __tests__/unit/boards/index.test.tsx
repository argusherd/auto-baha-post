import Boards from "@/renderer/app/posts/_boards";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockedAxios } from "../setup/mock";

describe("the boards component", () => {
  let rerender;
  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: "Tech" },
      { id: 2, name: "Gaming" },
    ],
  });

  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => {
      ({ rerender } = render(<Boards />));
    });
  });

  it("can list all the boards", async () => {
    const boards = screen.getAllByRole("listitem");

    expect(boards[0]).toHaveTextContent("Tech");
    expect(boards[1]).toHaveTextContent("Gaming");
  });

  it("has a default value of 'Publish to'", async () => {
    const defaultValue = screen.getByRole("textbox");
    const display = screen.getByRole("heading");

    expect(defaultValue).toHaveValue("");
    expect(display).toBeInTheDocument();
  });

  it("can set the default value", async () => {
    await waitFor(() => rerender(<Boards defaultValue={2} />));

    const publishTo = screen.getByRole("textbox");
    const display = screen.getByRole("heading");

    expect(publishTo).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });

  it("can select a board as an assignment", async () => {
    const boards = screen.getAllByRole("listitem");

    await userEvent.click(boards[1]);

    const publishTo = screen.getByRole("textbox");
    const display = screen.getByRole("heading");

    expect(publishTo).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });
});
