import ShowPost from "@/renderer/app/posts/show/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import {
  mockedAxios,
  mockParamsGet,
  mockPostPageApi,
  mockRouterPush,
} from "../setup/mock";

describe("show a post page", () => {
  let rerender;
  const POST_ID = "1";
  const mockedPush = mockRouterPush();

  mockParamsGet(POST_ID);
  mockPostPageApi(POST_ID);

  beforeEach(async () => {
    await waitFor(() => {
      ({ rerender } = render(<ShowPost />));
    });
  });

  it("can view a specified post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");

    expect(title).toHaveDisplayValue("My first post");
    expect(content).toHaveDisplayValue("Content in post");
  });

  it("lists all the boards in the page", async () => {
    const boards = screen.getAllByRole("listitem");

    expect(boards[0]).toHaveTextContent("Tech");
    expect(boards[1]).toHaveTextContent("Gaming");
  });

  it("shows the board assigned by the post", async () => {
    await waitFor(() => rerender(<ShowPost />));

    const board = screen.getByPlaceholderText("board");
    const display = screen.getByRole("heading");

    expect(board).toHaveValue("1");
    expect(display).toHaveTextContent("Tech");
  });

  it("redirecting you to the create post page if the post is not exist", async () => {
    mockedAxios.get.mockResolvedValue({
      status: 404,
    });

    await waitFor(() => render(<ShowPost />));

    expect(mockedPush).toBeCalledTimes(1);
    expect(mockedPush).toBeCalledWith("/posts/create");
  });
});
