import CreateBoard from "@/renderer/app/posts/_boards/create";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios } from "../setup/mock";

describe("create a board component", () => {
  const mockedPost = jest.fn();
  const mockedFetchBoards = jest.fn();

  userEvent.setup();
  mockedAxios.post = mockedPost;

  beforeEach(async () => {
    await waitFor(() =>
      render(
        <CreateBoard
          fetchBoards={mockedFetchBoards}
          setIsCreating={jest.fn()}
        />
      )
    );
  });

  it("has inputs for the properties of a board", async () => {
    const no = screen.getByPlaceholderText("No");
    const name = screen.getByPlaceholderText("Name");

    expect(no).toBeInTheDocument();
    expect(name).toBeInTheDocument();

    await userEvent.type(no, "123456");
    await userEvent.type(name, "Gaming");

    expect(no).toHaveDisplayValue("123456");
    expect(name).toHaveDisplayValue("Gaming");
  });

  it("handles the submission of creating a board", async () => {
    const no = screen.getByPlaceholderText("No");
    const name = screen.getByPlaceholderText("Name");
    const submit = screen.getByRole("button", { name: "Add" });

    await userEvent.type(no, "123456");
    await userEvent.type(name, "Gaming");
    await userEvent.click(submit);

    expect(mockedPost).toBeCalled();
    expect(mockedPost).toBeCalledWith(`${backendUrl}/api/boards`, {
      no: "123456",
      name: "Gaming",
    });
  });

  it("does not accept an empty value", async () => {
    const no = screen.getByPlaceholderText("No");
    const name = screen.getByPlaceholderText("Name");
    const submit = screen.getByRole("button", { name: "Add" });

    await userEvent.type(no, " ");
    await userEvent.type(name, " ");
    await userEvent.click(submit);

    const errorNo = screen.queryByText("The board's no should not be empty");
    const errorName = screen.queryByText(
      "The board's name should not be empty"
    );

    expect(mockedPost).not.toBeCalled();
    expect(errorNo).toBeInTheDocument();
    expect(errorName).toBeInTheDocument();
  });

  it("only accepts that the board's no is a number", async () => {
    const no = screen.getByPlaceholderText("No");
    const submit = screen.getByRole("button", { name: "Add" });

    await userEvent.type(no, "foobar");
    await userEvent.click(submit);

    const errorNo = screen.queryByText("The board's no should be a number");

    expect(errorNo).toBeInTheDocument();
  });

  it("refreshes the board list after added a new board", async () => {
    const no = screen.getByPlaceholderText("No");
    const name = screen.getByPlaceholderText("Name");
    const submit = screen.getByRole("button", { name: "Add" });

    await userEvent.type(no, "123456");
    await userEvent.type(name, "Gaming");
    await userEvent.click(submit);

    expect(mockedFetchBoards).toBeCalled();
  });
});
