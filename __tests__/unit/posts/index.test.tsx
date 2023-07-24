import PostIndex from "@/renderer/app/posts/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("view all posts page", () => {
  it("can list all posts", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "my first post",
          content: "content in the post",
        },
      ],
    });

    render(<PostIndex />);

    const posts = await waitFor(() => screen.getAllByRole("listitem"));

    expect(posts[0]).toHaveTextContent("my first post");
    expect(posts[0]).toHaveTextContent("content in the post");
  });

  it("can tell you there are no posts", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(<PostIndex />);

    const noPosts = await waitFor(() =>
      screen.queryByText("There are no posts.")
    );

    expect(noPosts).toBeInTheDocument();
  });
});
