import CreatePost from "@/renderer/app/posts/create/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { backendUrl, mockedAxios, mockRouterPush } from "../setup/mock";

describe("create post page", () => {
  const HTTP_CREATED = 201;
  const mockedPush = mockRouterPush();
  const boards = [
    { id: 1, name: "Tech" },
    { id: 2, name: "Gaming" },
  ];

  mockedAxios.post.mockResolvedValue({ status: HTTP_CREATED });
  mockedAxios.get.mockResolvedValue({ data: boards });
  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => render(<CreatePost />));
  });

  it("has a input field for the title", async () => {
    const titleInput = screen.queryByPlaceholderText("Title");

    expect(titleInput).toBeInTheDocument();

    await userEvent.type(titleInput, "Hello world");

    expect(titleInput).toHaveDisplayValue("Hello world");
  });

  it("has a input field for the content", async () => {
    const contentInput = screen.queryByPlaceholderText("Content");

    expect(contentInput).toBeInTheDocument();

    await userEvent.type(contentInput, "Hello world");

    expect(contentInput).toHaveDisplayValue("Hello world");
  });

  test("all required inputs should be filled", async () => {
    const submitButton = screen.getByRole("button", { name: "Save" });

    await userEvent.click(submitButton);

    const titleError = screen.queryByText("Title is required");
    const contentError = screen.queryByText("Content is required");

    expect(titleError).toBeInTheDocument();
    expect(contentError).toBeInTheDocument();
  });

  it("can handle submit event in order to persist post data", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: "Save" });
    const gaming = screen.getByText("Gaming");
    const datetime = moment().format("YYYY-MM-DDTHH:mm");

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(gaming);

    const scheduledAt = screen.getByLabelText("Schedule");

    await userEvent.type(scheduledAt, datetime);
    await userEvent.click(submitBtn);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(`${backendUrl}/api/posts`, {
      title: "My first post",
      content: "The content in my first post",
      board: 2,
      scheduled_at: datetime,
    });
  });

  it("resets input fields after submit create a post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: "Save" });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    expect(title).toHaveDisplayValue("");
    expect(content).toHaveDisplayValue("");
  });

  it("redirect you to all posts page after successfully create a post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: "Save" });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    expect(mockedPush).toBeCalledTimes(1);
    expect(mockedPush).toBeCalledWith("/posts");
  });

  it("lists all available boards for assignment", async () => {
    const boards = screen.getAllByRole("listitem");

    expect(boards[0]).toHaveTextContent("Tech");
    expect(boards[1]).toHaveTextContent("Gaming");
  });

  it("can select a board as an assignment", async () => {
    const board = screen.getByPlaceholderText("board");
    const option2nd = screen.getByText("Gaming");

    await userEvent.click(option2nd);

    expect(board).toHaveValue("2");
  });

  it("can schedule the post after it is assigning a board", async () => {
    const option2nd = screen.getByText("Gaming");

    let scheduledAt = screen.queryByLabelText("Schedule");

    expect(scheduledAt).not.toBeInTheDocument();

    await userEvent.click(option2nd);

    scheduledAt = screen.queryByLabelText("Schedule");

    expect(scheduledAt).toBeInTheDocument();
  });
});
