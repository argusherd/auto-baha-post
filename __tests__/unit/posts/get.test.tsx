import ViewPost from "@/renderer/app/posts/get/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockedPush,
});
(useSearchParams as jest.Mock).mockReturnValue({
  get: jest.fn(),
});

describe("get a post page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("can view a specified page", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        title: "My first post",
        content: "Content in post",
      },
    });

    render(<ViewPost />);

    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");

    await waitFor(() => {
      expect(title).toHaveDisplayValue("My first post");
      expect(content).toHaveDisplayValue("Content in post");
    });
  });

  it("redirecting you to the create post page if the post is not exist", async () => {
    mockedAxios.get.mockResolvedValue({
      status: 404,
    });

    render(<ViewPost />);

    await waitFor(() => {
      expect(mockedPush).toBeCalledTimes(1);
      expect(mockedPush).toBeCalledWith("/posts/create");
    });
  });
});
