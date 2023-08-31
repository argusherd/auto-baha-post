import Board from "@/backend-api/database/entities/Board";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import BoardItem from "@/renderer/app/posts/_boards/board";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { backendUrl, mockedAxios, renderUseFormHook } from "../setup/mock";

describe("edit in board item component", () => {
  const boardId = 1;
  let board: Board;
  let formHook: UseFormReturn;
  const mockedFetchBoards = jest.fn();

  userEvent.setup();

  beforeEach(async () => {
    board = await new BoardFactory().make({ id: boardId });
    formHook = renderUseFormHook();

    render(
      <FormProvider {...formHook}>
        <BoardItem board={board} fetchBoards={mockedFetchBoards} />
      </FormProvider>
    );
  });

  it("can switch to edit mode", async () => {
    const editBtn = screen.getByRole("button", { name: "Edit" });

    await userEvent.click(editBtn);

    const boardNo = screen.getByPlaceholderText("No");
    const boardName = screen.getByPlaceholderText("Name");

    expect(boardNo).toHaveValue(board.no);
    expect(boardName).toHaveValue(board.name);
  });

  it("can switch back to display mode", async () => {
    let editBtn = screen.getByRole("button", { name: "Edit" });

    await userEvent.click(editBtn);

    editBtn = screen.queryByRole("button", { name: "Edit" });

    expect(editBtn).not.toBeInTheDocument();

    let cancelBtn = screen.getByRole("button", { name: "Cancel" });

    await userEvent.click(cancelBtn);

    cancelBtn = screen.queryByRole("button", { name: "Cancel" });
    editBtn = screen.queryByRole("button", { name: "Edit" });

    expect(cancelBtn).not.toBeInTheDocument();
    expect(editBtn).toBeInTheDocument();
  });

  it("can handle the submit event to update a board", async () => {
    const mockedPut = jest.fn();
    mockedAxios.put = mockedPut;

    const editBtn = screen.getByRole("button", { name: "Edit" });

    await userEvent.click(editBtn);

    const boardNo = screen.getByPlaceholderText("No");
    const boardName = screen.getByPlaceholderText("Name");
    const confirm = screen.getByRole("button", { name: "Confirm" });

    await userEvent.clear(boardNo);
    await userEvent.clear(boardName);
    await userEvent.type(boardNo, "123456");
    await userEvent.type(boardName, "New board");
    await userEvent.click(confirm);

    expect(mockedPut).toBeCalledWith(`${backendUrl}/api/boards/${boardId}`, {
      no: "123456",
      name: "New board",
    });
  });

  it("refreshes the board list after update the board", async () => {
    const editBtn = screen.getByRole("button", { name: "Edit" });

    await userEvent.click(editBtn);

    const confirm = screen.getByRole("button", { name: "Confirm" });

    await userEvent.click(confirm);

    expect(mockedFetchBoards).toBeCalled();
  });
});
