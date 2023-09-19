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

describe("the boards component", () => {
  let rerender;
  let formHook: UseFormReturn;
  let setValue: UseFormSetValue<FieldValues>;
  const rerenderBoards = () =>
    rerender(
      <FormProvider {...formHook}>
        <Boards />
      </FormProvider>
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
        </FormProvider>
      ));
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

    expect(display).toHaveTextContent("Publish to");
  });

  it("can select a board as an assignment", async () => {
    const gaming = screen.getByText("Gaming");

    await userEvent.click(gaming);

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("2");
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

  it("close the form that create a new board after successfully create one", async () => {
    const addBoardBtn = screen.getByRole("button", { name: "Add new board" });

    await userEvent.click(addBoardBtn);

    const no = screen.getByPlaceholderText("No");
    const name = screen.getByPlaceholderText("Name");
    const add = screen.getByRole("button", { name: "Add" });

    await userEvent.type(no, "123456");
    await userEvent.type(name, "New board");
    await userEvent.click(add);

    expect(no).not.toBeInTheDocument();
    expect(name).not.toBeInTheDocument();
  });

  it("can cancel the creation of a new board", async () => {
    const addBoardBtn = screen.getByRole("button", { name: "Add new board" });

    await userEvent.click(addBoardBtn);

    const add = screen.queryByRole("button", { name: "Add" });
    const cancel = screen.getByRole("button", { name: "Cancel" });

    expect(add).toBeInTheDocument();
    expect(cancel).toBeInTheDocument();

    await userEvent.click(cancel);

    expect(add).not.toBeInTheDocument();
    expect(cancel).not.toBeInTheDocument();
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

    expect(display).toHaveTextContent("Publish to");
  });
});
