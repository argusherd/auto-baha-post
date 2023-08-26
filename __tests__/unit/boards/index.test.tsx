import Boards from "@/renderer/app/posts/_boards";
import "@testing-library/jest-dom";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FieldValues,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { mockedAxios } from "../setup/mock";

describe("the boards component", () => {
  let rerender;
  let register: UseFormRegister<FieldValues>;
  let setValue: UseFormSetValue<FieldValues>;

  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: "Tech" },
      { id: 2, name: "Gaming" },
    ],
  });

  userEvent.setup();

  beforeEach(async () => {
    const {
      result: { current },
    } = renderHook(() => useForm());

    ({ register, setValue } = current);

    await waitFor(() => {
      ({ rerender } = render(
        <Boards register={register} setValue={setValue} />
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

  it("can specify the default value", async () => {
    await waitFor(() =>
      rerender(
        <Boards defaultValue={2} register={register} setValue={setValue} />
      )
    );

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("2");
    expect(display).toBeInTheDocument();
  });

  it("sholud has empty value if specify a value that not in the board list", async () => {
    await waitFor(() =>
      rerender(
        <Boards defaultValue={999999} register={register} setValue={setValue} />
      )
    );

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("");
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
});
