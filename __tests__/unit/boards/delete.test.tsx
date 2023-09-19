import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import BoardItem from "@/renderer/app/posts/_boards/board";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { backendUrl, mockedAxios, renderUseFormHook } from "../setup/mock";

describe("delete in board item component", () => {
  const boardId = 1;
  const mockedDelete = jest.fn();
  const mockedFetchBoards = jest.fn();
  let formHook: UseFormReturn;

  userEvent.setup();
  mockedAxios.delete = mockedDelete;

  beforeEach(async () => {
    formHook = renderUseFormHook();

    const board = await new BoardFactory().make({ id: boardId });
    const { setValue } = formHook;

    setValue("board_id", boardId);

    render(
      <FormProvider {...formHook}>
        <BoardItem board={board} fetchBoards={mockedFetchBoards} />
      </FormProvider>
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

  it("resets parent form value after delete the corresponsive board", async () => {
    const { getValues } = formHook;
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    expect(getValues("board_id")).toEqual(boardId);

    await userEvent.click(deleteBtn);

    expect(getValues("board_id")).toEqual("");
  });
});
