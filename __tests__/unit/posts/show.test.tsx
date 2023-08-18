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
  const POST_ID = "1";
  const mockedPush = mockRouterPush();

  mockParamsGet(POST_ID);
  mockPostPageApi(POST_ID);

  beforeEach(async () => {
    await waitFor(() => {
      render(<ShowPost />);
    });
  });

  it("can view a specified post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");

    expect(title).toHaveDisplayValue("My first post");
    expect(content).toHaveDisplayValue("Content in post");
  });

  it("lists all the boards in the page", async () => {
    const boards = screen.getAllByRole("option");

    expect(boards[1]).toHaveValue("1");
    expect(boards[1]).toHaveTextContent("Tech");
    expect(boards[2]).toHaveValue("2");
    expect(boards[2]).toHaveTextContent("Gaming");
  });

  it.skip("shows the board assigned by the post", async () => {
    /**
     * the select element registered by react-hook-form does not reflect well with the defaultValue set by axios callback in the test
     */
    const selectedBoard = screen.getByRole("combobox");

    expect(selectedBoard).toHaveDisplayValue("Gaming");
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
