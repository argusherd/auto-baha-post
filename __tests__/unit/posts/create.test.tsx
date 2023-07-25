import CreatePost from "@/renderer/app/posts/create/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useRouter } from "next/navigation";
const HTTP_CREATED = 201;

jest.mock("axios");
jest.mock("next/navigation");

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValue({ status: HTTP_CREATED });

const mockedPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockedPush,
});

describe("create post page", () => {
  beforeEach(() => {
    userEvent.setup();

    render(<CreatePost />);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    await waitFor(() => {
      expect(titleError).toBeInTheDocument();
      expect(contentError).toBeInTheDocument();
    });
  });

  it("can handle submit event in order to persist post data", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: "Save" });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedAxios.post).toBeCalledTimes(1);
    });
  });

  it("resets input fields after submit create a post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: "Save" });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(title).toHaveDisplayValue("");
      expect(content).toHaveDisplayValue("");
    });
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
