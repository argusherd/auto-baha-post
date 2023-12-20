import CreateBoard from "@/renderer/app/posts/_boards/create";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios } from "../setup/mock";

describe("the create a board component", () => {
  let rerender;
  const mockedPost = jest.fn();
  const mockedFetchBoards = jest.fn();

  userEvent.setup();
  mockedAxios.post = mockedPost;

  beforeEach(async () => {
    await waitFor(
      () =>
        ({ rerender } = render(
          <CreateBoard fetchBoards={mockedFetchBoards} />,
        )),
    );
  });

  it("has inputs for the properties of a board", async () => {
    const name = screen.getByPlaceholderText("Board name");
    const no = screen.getByPlaceholderText("Board serial number");

    expect(no).toBeInTheDocument();
    expect(name).toBeInTheDocument();

    await userEvent.type(no, "123456");
    await userEvent.type(name, "Gaming");

    expect(no).toHaveDisplayValue("123456");
    expect(name).toHaveDisplayValue("Gaming");
  });

  it("handles the submission of creating a board", async () => {
    const name = screen.getByPlaceholderText("Board name");
    const no = screen.getByPlaceholderText("Board serial number");
    const submit = screen.getByRole("button", { name: "create-board" });

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
    const name = screen.getByPlaceholderText("Board name");
    const no = screen.getByPlaceholderText("Board serial number");
    const submit = screen.getByRole("button", { name: "create-board" });

    await userEvent.type(no, " ");
    await userEvent.type(name, " ");
    await userEvent.click(submit);

    const errorName = screen.queryByText("Board name should not be empty.");
    const errorNo = screen.queryByText(
      "Board serial number should not be empty.",
    );

    expect(mockedPost).not.toBeCalled();
    expect(errorNo).toBeInTheDocument();
    expect(errorName).toBeInTheDocument();
  });

  it("only accepts that the board serial number is a number", async () => {
    const no = screen.getByPlaceholderText("Board serial number");
    const submit = screen.getByRole("button", { name: "create-board" });

    await userEvent.type(no, "foobar");
    await userEvent.click(submit);

    const errorNo = screen.getByText(
      "Board serial number should be a numberic.",
    );

    expect(errorNo).toBeInTheDocument();
  });

  it("refreshes the board list after added a new board", async () => {
    const name = screen.getByPlaceholderText("Board name");
    const no = screen.getByPlaceholderText("Board serial number");
    const submit = screen.getByRole("button", { name: "create-board" });

    await userEvent.type(no, "123456");
    await userEvent.type(name, "Gaming");
    await userEvent.click(submit);

    expect(mockedFetchBoards).toBeCalled();
  });
});
