import CreatePost from "@/renderer/app/posts/create/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios, mockRouterPush } from "../setup/mock";

describe("create post page", () => {
  const HTTP_CREATED = 201;
  const mockedPush = mockRouterPush();

  mockedAxios.post.mockResolvedValue({ status: HTTP_CREATED });
  userEvent.setup();

  beforeEach(() => {
    render(<CreatePost />);
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

  test("all inputs should be filled", async () => {
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

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(`${backendUrl}/api/posts`, {
      title: "My first post",
      content: "The content in my first post",
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
});
