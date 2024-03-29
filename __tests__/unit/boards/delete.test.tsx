import Board from "@/backend-api/database/entities/Board";
import BoardItem from "@/renderer/app/posts/_boards/board";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { backendUrl, mockedAxios, renderUseFormHook } from "../setup/mock";

describe("delete in board item component", () => {
  const boardId = 1;
  const board = {
    id: boardId,
    name: "foo",
    no: "123456",
  };
  const mockedDelete = jest.fn();
  const mockedFetchBoards = jest.fn();
  let formHook: UseFormReturn;

  userEvent.setup();
  mockedAxios.delete = mockedDelete;

  beforeEach(async () => {
    formHook = renderUseFormHook();

    const { setValue } = formHook;

    setValue("board_id", boardId);

    render(
      <FormProvider {...formHook}>
        <BoardItem board={board as Board} fetchBoards={mockedFetchBoards} />
      </FormProvider>,
    );
  });

  it("can send out delete a board request", async () => {
    const deleteBtn = screen.getByRole("button", { name: /delete/ });

    await userEvent.click(deleteBtn);

    expect(mockedDelete).toBeCalledWith(`${backendUrl}/api/boards/${boardId}`);
  });

  it("refreshes the board list after successfully delete the board", async () => {
    const deleteBtn = screen.getByRole("button", { name: /delete/ });

    await userEvent.click(deleteBtn);

    expect(mockedFetchBoards).toBeCalled();
  });

  it("resets parent form value after delete the corresponsive board", async () => {
    const { getValues, setValue } = formHook;

    const deleteBtn = screen.getByRole("button", { name: /delete/ });

    setValue("scheduled_at", moment().toISOString());

    expect(getValues("board_id")).toEqual(boardId);
    expect(getValues("scheduled_at")).not.toEqual("");

    await userEvent.click(deleteBtn);

    expect(getValues("board_id")).toEqual("");
    expect(getValues("scheduled_at")).toEqual("");
  });
});
