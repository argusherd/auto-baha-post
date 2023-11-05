import Post from "@/backend-api/database/entities/Post";
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
  let rerender;
  let unmount;
  const POST_ID = "1";
  const mockedPut = jest.fn().mockResolvedValue({ data: {} });
  const postData: Partial<Post> = {
    title: "My first post",
    demonstratio: "2",
    sub_board: "2",
    subject: "3",
    content: "Content in post",
    board_id: 1,
  };

  mockedAxios.put = mockedPut;
  mockParamsGet(POST_ID);
  mockPostPageApi(POST_ID, postData);
  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => ({ rerender, unmount } = render(<ShowPost />)));
  });

  it("shows the post's details", async () => {
    await waitFor(() => rerender(<ShowPost />));

    const title = screen.getByPlaceholderText("Title");
    const demonstratio = screen.getByPlaceholderText("Demonstratio");
    const subBoard = screen.getByPlaceholderText("Sub Board");
    const subject = screen.getByPlaceholderText("Subject");
    const content = screen.getByPlaceholderText("Content");
    const board = screen.getByPlaceholderText("board");

    await waitFor(() => rerender(<ShowPost />));

    expect(title).toHaveValue("My first post");
    expect(demonstratio).toHaveValue("2");
    expect(subBoard).toHaveValue("2");
    expect(subject).toHaveValue("3");
    expect(content).toHaveValue("Content in post");
    expect(board).toHaveValue("1");
  });

  it("can handle a submit event to persist new post data", async () => {
    await waitFor(() => rerender(<ShowPost />));
    await userEvent.click(screen.getByRole("heading"));

    const title = screen.getByPlaceholderText("Title");
    const demonstratio = screen.getByPlaceholderText("Demonstratio");
    const subBoard = screen.getByPlaceholderText("Sub Board");
    const subject = screen.getByPlaceholderText("Subject");
    const content = screen.getByPlaceholderText("Content");
    const gaming = screen.getByText("Gaming");
    const submit = screen.getByRole("button", { name: "Save" });
    const scheduledAt = screen.getByPlaceholderText("Scheduled At");
    const datetime = moment().format("YYYY-MM-DDTHH:mm");

    await userEvent.click(gaming);

    await userEvent.clear(title);
    await userEvent.clear(content);
    await userEvent.type(title, "New title");
    await userEvent.selectOptions(demonstratio, "1");
    await userEvent.selectOptions(subBoard, "1");
    await userEvent.type(subject, "3");
    await userEvent.type(content, "New content");
    await userEvent.type(scheduledAt, datetime);
    await userEvent.click(submit);

    expect(mockedPut).toBeCalled();
    expect(mockedPut).toBeCalledWith(`${backendUrl}/api/posts/${POST_ID}`, {
      title: "New title",
      demonstratio: "1",
      sub_board: "1",
      subject: "3",
      content: "New content",
      board_id: 2,
      scheduled_at: datetime,
    });
  });

  it("can manaully publish the post if it has assigned to a board", async () => {
    mockPostPageApi(POST_ID, {
      board_id: null,
    });

    unmount();

    await waitFor(() => render(<ShowPost />));

    const publishNow = screen.getByRole("button", { name: /publish-now/ });

    expect(publishNow).toBeDisabled();

    mockedAxios.put.mockResolvedValue({ data: { board_id: 1 } });

    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");
    const submit = screen.getByRole("button", { name: "Save" });

    await userEvent.click(gaming);
    await userEvent.click(submit);

    expect(publishNow).toBeEnabled();
  });

  it("reminds you if the inputs are changed (dirty)", async () => {
    expect(screen.queryByTestId("is-dirty")).not.toBeInTheDocument();

    const title = screen.getByPlaceholderText("Title");

    await userEvent.type(title, "new");

    expect(screen.queryByTestId("is-dirty")).toBeInTheDocument();
  });

  it("removes the dirty reminder after editing the post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const submit = screen.getByRole("button", { name: "Save" });

    await userEvent.type(title, "new");

    expect(screen.queryByTestId("is-dirty")).toBeInTheDocument();

    await userEvent.click(submit);

    expect(screen.queryByTestId("is-dirty")).not.toBeInTheDocument();
  });
});
