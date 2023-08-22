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
    const defaultValue = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(defaultValue).toHaveValue("");
    expect(display).toBeInTheDocument();
  });

  it("can set the default value", async () => {
    await waitFor(() => rerender(<Boards defaultValue={2} />));

    const publishTo = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(publishTo).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });

  it("can select a board as an assignment", async () => {
    const boards = screen.getAllByRole("listitem");

    await userEvent.click(boards[1]);

    const publishTo = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(publishTo).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });

  it("opens the form that create a new board", async () => {
    const addBtn = screen.getByRole("button", { name: "Add new board" });
    let no = screen.queryByPlaceholderText("No");
    let name = screen.queryByPlaceholderText("Name");

    expect(no).toBeNull();
    expect(name).toBeNull();

    await userEvent.click(addBtn);

    no = screen.queryByPlaceholderText("No");
    name = screen.queryByPlaceholderText("Name");

    expect(no).toBeInTheDocument();
    expect(name).toBeInTheDocument();
  });
});
