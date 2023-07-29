import ViewPost from "@/renderer/app/posts/get/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useSearchParams } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation");

const POST_ID = 1;
const DOMAIN = "http://localhost";

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedPut = jest.fn();
mockedAxios.put = mockedPut;

(useSearchParams as jest.Mock).mockReturnValue({
  get: () => POST_ID,
});

Object.defineProperty(window, "backendUrl", {
  configurable: true,
  value: DOMAIN,
  writable: true,
});

describe("update post in get a post page", () => {
  beforeEach(() => {
    userEvent.setup();

    mockedAxios.get.mockResolvedValue({
      data: {
        title: "My first post",
        content: "Content in the post",
      },
    });

    render(<ViewPost />);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    const content = screen.getByPlaceholderText("Content");
    const submit = screen.getByRole("button", { name: "Save" });

    await userEvent.clear(title);
    await userEvent.type(title, "New title");
    await userEvent.clear(content);
    await userEvent.type(content, "New content");
    await userEvent.click(submit);

    expect(mockedPut).toBeCalled();
    expect(mockedPut).toBeCalledWith(`${DOMAIN}/api/posts/${POST_ID}`, {
      title: "New title",
      content: "New content",
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
});
