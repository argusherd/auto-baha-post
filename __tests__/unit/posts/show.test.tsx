import ShowPost from "@/renderer/app/posts/show/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { mockedAxios, mockParamsGet, mockRouterPush } from "../setup/mock";

describe("show a post page", () => {
  const mockedPush = mockRouterPush();
  mockParamsGet("POST_ID");

  it("can view a specified page", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        title: "My first post",
        content: "Content in post",
      },
    });

    await waitFor(() => {
      render(<ShowPost />);
    });

    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");

    expect(title).toHaveDisplayValue("My first post");
    expect(content).toHaveDisplayValue("Content in post");
  });

  it("redirecting you to the create post page if the post is not exist", async () => {
    mockedAxios.get.mockResolvedValue({
      status: 404,
    });

    await waitFor(() => {
      render(<ShowPost />);
    });

    expect(mockedPush).toBeCalledTimes(1);
    expect(mockedPush).toBeCalledWith("/posts/create");
  });
});
