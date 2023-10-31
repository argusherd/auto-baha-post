import Board from "@/backend-api/database/entities/Board";
import BoardItem from "@/renderer/app/posts/_boards/board";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { backendUrl, mockedAxios, renderUseFormHook } from "../setup/mock";

describe("edit in board item component", () => {
  const boardId = 1;
  const board = {
    id: boardId,
    name: "foo",
    no: "123456",
  };
  let formHook: UseFormReturn;
  const mockedFetchBoards = jest.fn();

  beforeEach(async () => {
    formHook = renderUseFormHook();

    render(
      <FormProvider {...formHook}>
        <BoardItem board={board as Board} fetchBoards={mockedFetchBoards} />
      </FormProvider>,
    );
  });

  it("can switch to edit mode", async () => {
    let editBtn = screen.getByRole("button", { name: /edit/ });
    let deleteBtn = screen.getByRole("button", { name: /delete/ });
    let display = screen.getByTestId("display");

    await userEvent.click(editBtn);

    const inputName = screen.getByPlaceholderText("Board name");
    const inputNo = screen.getByPlaceholderText("Board serial number");

    editBtn = screen.queryByRole("button", { name: /edit/ });
    deleteBtn = screen.queryByRole("button", { name: /delete/ });
    display = screen.queryByTestId("display");

    expect(editBtn).not.toBeInTheDocument();
    expect(deleteBtn).not.toBeInTheDocument();
    expect(display).not.toBeInTheDocument();
    expect(inputName).toHaveValue(board.name);
    expect(inputNo).toHaveValue(board.no);
  });

  it("can switch back to display mode", async () => {
    await userEvent.click(screen.getByRole("button", { name: /edit/ }));

    let confirmBtn = screen.getByRole("button", { name: /confirm/ });
    let cancelBtn = screen.getByRole("button", { name: /cancel/ });

    await userEvent.click(cancelBtn);

    const display = screen.getByTestId("display");

    confirmBtn = screen.queryByRole("button", { name: /confirm/ });
    cancelBtn = screen.queryByRole("button", { name: /cancel/ });

    expect(confirmBtn).not.toBeInTheDocument();
    expect(cancelBtn).not.toBeInTheDocument();
    expect(display).toBeInTheDocument();
  });

  it("can handle the submit event to update a board", async () => {
    const mockedPut = jest.fn();
    mockedAxios.put = mockedPut;

    await userEvent.click(screen.getByRole("button", { name: /edit/ }));

    const boardName = screen.getByPlaceholderText("Board name");
    const boardNo = screen.getByPlaceholderText("Board serial number");

    await userEvent.clear(boardName);
    await userEvent.clear(boardNo);
    await userEvent.type(boardName, "New board");
    await userEvent.type(boardNo, "123456");
    await userEvent.click(screen.getByRole("button", { name: /confirm/ }));

    expect(mockedPut).toBeCalledWith(`${backendUrl}/api/boards/${boardId}`, {
      no: "123456",
      name: "New board",
    });
  });

  it("refreshes the board list after updating the board", async () => {
    await userEvent.click(screen.getByRole("button", { name: /edit/ }));

    await userEvent.click(screen.getByRole("button", { name: /confirm/ }));

    expect(mockedFetchBoards).toBeCalled();
  });

  it("switches from edit mode to display mode after successfully update the board", async () => {
    await userEvent.click(screen.getByRole("button", { name: /edit/ }));

    const boardName = screen.getByPlaceholderText("Board name");
    const boardNo = screen.getByPlaceholderText("Board serial number");

    await userEvent.clear(boardName);
    await userEvent.clear(boardNo);
    await userEvent.type(boardName, "New board");
    await userEvent.type(boardNo, "123456");
    await userEvent.click(screen.getByRole("button", { name: /confirm/ }));

    const display = screen.getByTestId("display");

    expect(boardNo).not.toBeInTheDocument();
    expect(boardName).not.toBeInTheDocument();
    expect(display).toBeInTheDocument();
  });
});
