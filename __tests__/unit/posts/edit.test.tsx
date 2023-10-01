import ShowPost from "@/renderer/app/posts/show/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import {
  backendUrl,
  mockedAxios,
  mockParamsGet,
  mockPostPageApi,
} from "../setup/mock";

describe("edit a post in show a post page", () => {
  let unmount;
  const POST_ID = "1";
  const mockedPut = jest.fn().mockResolvedValue({ data: {} });

  mockedAxios.put = mockedPut;
  mockParamsGet(POST_ID);
  mockPostPageApi(POST_ID);
  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => ({ unmount } = render(<ShowPost />)));
  });

  it("can change a post's title and content", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");

    await userEvent.clear(title);
    await userEvent.type(title, "New title");
    await userEvent.clear(content);
    await userEvent.type(content, "New content");

    expect(title).toHaveValue("New title");
    expect(content).toHaveValue("New content");
  });

  it("can handle a submit event to persist new post data", async () => {
    const title = screen.getByPlaceholderText("Title");
    const demonstratio = screen.getByPlaceholderText("Demonstratio");
    const subBoard = screen.getByPlaceholderText("Sub Board");
    const subject = screen.getByPlaceholderText("Subject");
    const content = screen.getByPlaceholderText("Content");
    const gaming = screen.getByText("Gaming");
    const submit = screen.getByRole("button", { name: "Save" });
    const datetime = moment().format("YYYY-MM-DDTHH:mm");

    await userEvent.clear(title);
    await userEvent.type(title, "New title");
    await userEvent.type(demonstratio, "1");
    await userEvent.type(subBoard, "1");
    await userEvent.type(subject, "1");
    await userEvent.clear(content);
    await userEvent.type(content, "New content");
    await userEvent.click(gaming);

    const scheduledAt = screen.getByLabelText("Schedule");

    await userEvent.type(scheduledAt, datetime);
    await userEvent.click(submit);

    expect(mockedPut).toBeCalled();
    expect(mockedPut).toBeCalledWith(`${backendUrl}/api/posts/${POST_ID}`, {
      title: "New title",
      demonstratio: 1,
      sub_board: 1,
      subject: 1,
      content: "New content",
      board_id: 2,
      scheduled_at: datetime,
    });
  });

  it("cannot submit an empty title or an empty content", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submit = screen.getByRole("button", { name: "Save" });

    await userEvent.clear(title);
    await userEvent.clear(content);
    await userEvent.click(submit);

    expect(mockedPut).not.toBeCalled();
  });

  it("can list all the boards for the assignment", async () => {
    const boards = screen.getAllByRole("listitem");

    expect(boards[0]).toHaveTextContent("Tech");
    expect(boards[1]).toHaveTextContent("Gaming");
  });

  it("can assign a board to the post", async () => {
    const board = screen.getByPlaceholderText("board");
    const gaming = screen.getByText("Gaming");

    await userEvent.click(gaming);

    expect(board).toHaveValue("2");
  });

  it("can schedule the post if a board was assigned to the post", async () => {
    const board = screen.getByPlaceholderText("board");
    const scheduledAt = screen.queryByLabelText("Schedule");

    expect(board).toHaveValue("1");
    expect(scheduledAt).toBeInTheDocument();
  });

  it("can manaully publish the post if it has assigned to a board", async () => {
    mockPostPageApi(POST_ID, {
      board_id: null,
    });

    unmount();

    await waitFor(() => render(<ShowPost />));

    const publishNow = screen.getByRole("button", { name: "Publish Now" });

    expect(publishNow).toBeDisabled();

    mockedAxios.put.mockResolvedValue({ data: { board_id: 1 } });

    const gaming = screen.getByText("Gaming");
    const submit = screen.getByRole("button", { name: "Save" });
    await userEvent.click(gaming);
    await userEvent.click(submit);

    expect(publishNow).not.toBeDisabled();
  });
});
