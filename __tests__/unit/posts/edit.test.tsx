import ShowPost from "@/renderer/app/posts/show/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios, mockParamsGet } from "../setup/mock";

describe("edit a post in show a post page", () => {
  const POST_ID = "1";
  const mockedPut = jest.fn();

  mockedAxios.put = mockedPut;
  mockParamsGet(POST_ID);
  userEvent.setup();

  mockedAxios.get.mockResolvedValue({
    data: {
      title: "My first post",
      content: "Content in the post",
    },
  });

  beforeEach(() => {
    render(<ShowPost />);
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
    expect(mockedPut).toBeCalledWith(`${backendUrl}/api/posts/${POST_ID}`, {
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
