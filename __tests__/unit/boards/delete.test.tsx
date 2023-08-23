import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import BoardItem from "@/renderer/app/posts/_boards/board";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios } from "../setup/mock";

describe("delete in board item component", () => {
  const boardId = 1;
  const mockedDelete = jest.fn();
  const mockedAssign = jest.fn();
  const mockedFetchBoards = jest.fn();

  userEvent.setup();
  mockedAxios.delete = mockedDelete;

  beforeEach(async () => {
    const board = await new BoardFactory().make({ id: boardId });

    render(
      <BoardItem
        board={board}
        assign={mockedAssign}
        fetchBoards={mockedFetchBoards}
      />
    );
  });

  it("can send out delete a board request", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    expect(mockedDelete).toBeCalledWith(`${backendUrl}/api/boards/${boardId}`);
  });

  it("refreshes the board list after successfully delete the board", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    expect(mockedFetchBoards).toBeCalled();
  });
});
