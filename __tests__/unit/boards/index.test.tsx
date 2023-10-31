import Boards from "@/renderer/app/posts/_boards";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FieldValues,
  FormProvider,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form";
import { mockedAxios, renderUseFormHook } from "../setup/mock";

describe("the board list component", () => {
  let rerender;
  let formHook: UseFormReturn;
  let setValue: UseFormSetValue<FieldValues>;
  const rerenderBoards = () =>
    rerender(
      <FormProvider {...formHook}>
        <Boards />
      </FormProvider>,
    );

  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: "Tech" },
      { id: 2, name: "Gaming" },
    ],
  });

  userEvent.setup();

  beforeEach(async () => {
    formHook = renderUseFormHook();
    ({ setValue } = formHook);

    await waitFor(() => {
      ({ rerender } = render(
        <FormProvider {...formHook}>
          <Boards />
        </FormProvider>,
      ));
    });
  });

  it("can open the list that displays all the boards", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const boards = screen.getAllByRole("listitem");

    expect(boards[1]).toHaveTextContent("Tech");
    expect(boards[2]).toHaveTextContent("Gaming");
  });

  it("can close the list that displays all the boards", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const boardList = screen.getByRole("list");

    expect(boardList).toBeInTheDocument();

    await userEvent.click(screen.getByRole("heading"));

    expect(boardList).not.toBeInTheDocument();
  });

  it("has a default value of 'null'", async () => {
    const defaultValue = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(defaultValue).toHaveValue("");
    expect(display).toHaveTextContent("Select a board to publish on.");
  });

  it("can reflect the one we pick", async () => {
    await waitFor(() => {
      setValue("board_id", 2);
      rerenderBoards();
    });

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("2");
    expect(display).toHaveTextContent("Gaming");
  });

  it("sholud display the default string if specify a value that not in the board list", async () => {
    await waitFor(() => {
      setValue("board_id", 99999999);
      rerenderBoards();
    });

    const display = screen.getByRole("heading");

    expect(display).toHaveTextContent("Select a board to publish on.");
  });

  it("can select a board as an assignment", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");

    await userEvent.click(gaming);

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });

  it("closes the board list after selecting a board for an assignment", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");
    const boardList = screen.getByRole("list");

    await userEvent.click(gaming);

    await waitFor(rerenderBoards);

    expect(boardList).not.toBeInTheDocument();
  });

  it("can open the form that create a new board", async () => {
    let inputName = screen.queryByPlaceholderText("Board name");
    let inputNo = screen.queryByPlaceholderText("Board serial number");

    expect(inputNo).toBeNull();
    expect(inputName).toBeNull();

    const openList = screen.getByRole("heading");

    await userEvent.click(openList);

    inputName = screen.queryByPlaceholderText("Board name");
    inputNo = screen.queryByPlaceholderText("Board serial number");

    expect(inputNo).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
  });

  it("should display the default string if the board value is set to null", async () => {
    await waitFor(() => {
      setValue("board_id", 2);
      rerenderBoards();
    });

    const display = screen.getByRole("heading");

    expect(display).toHaveTextContent("Gaming");

    await waitFor(() => {
      setValue("board_id", null);
      rerenderBoards();
    });

    expect(display).toHaveTextContent("Select a board to publish on.");
  });
});
