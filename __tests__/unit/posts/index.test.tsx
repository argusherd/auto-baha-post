import PostIndex from "@/renderer/app/posts/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { backendUrl, mockedAxios, mockRouterPush } from "../setup/mock";

describe("view all posts page", () => {
  let unmount;
  let mockedPush: jest.Func;

  beforeEach(async () => {
    mockedPush = mockRouterPush();

    mockedAxios.get.mockResolvedValue({ data: { data: [] } });

    await waitFor(() => ({ unmount } = render(<PostIndex />)));
  });

  it("can list all posts", async () => {
    unmount();

    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            title: "my first post",
            content: "content in the post",
          },
        ],
      },
    });

    await waitFor(() => render(<PostIndex />));

    const posts = await waitFor(() => screen.getAllByRole("listitem"));

    expect(posts[0]).toHaveTextContent("my first post");
    expect(posts[0]).toHaveTextContent("content in the post");
  });

  it("can tell you there are no posts", async () => {
    const noPosts = screen.queryByText("There are currently no posts.");

    expect(noPosts).toBeInTheDocument();
  });

  it("shows the name of the assigned board for the post", async () => {
    unmount();

    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            title: "my first post",
            content: "content in the post",
            board: {
              name: "Gaming",
            },
          },
        ],
      },
    });

    await waitFor(() => render(<PostIndex />));

    const boardName = screen.getByTestId("board-name");

    expect(boardName).toHaveTextContent("Board: Gaming");
  });

  it("has a filter that selects which type of posts to list", async () => {
    const types = screen.getAllByTestId("type");

    expect(types[0]).toHaveValue("");
    expect(types[1]).toHaveValue("upcoming");
    expect(types[2]).toHaveValue("failed");
    expect(types[3]).toHaveValue("outdated");
    expect(types[4]).toHaveValue("draft");
    expect(types[5]).toHaveValue("published");
  });

  it("can change the type of posts to retrieve", async () => {
    unmount();

    const mockedGet = jest.fn().mockResolvedValue({ data: { data: [] } });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<PostIndex />));

    const typeSelector = screen.getByTestId("types");

    await userEvent.selectOptions(typeSelector, "upcoming");

    expect(mockedGet).toBeCalledWith(`${backendUrl}/api/posts/upcoming`);
  });

  it("resets the page param if the type of posts is changed", async () => {
    const typeSelector = screen.getByTestId("types");

    await userEvent.selectOptions(typeSelector, "upcoming");

    expect(mockedPush).toBeCalledWith("/posts?page=1&type=upcoming");
  });

  it("has options that change the sorting column", async () => {
    const sortByColumns = screen.getAllByTestId("sort-by-column");

    expect(sortByColumns[0]).toHaveValue("updated_at");
    expect(sortByColumns[1]).toHaveValue("created_at");
    expect(sortByColumns[2]).toHaveValue("scheduled_at");
    expect(sortByColumns[3]).toHaveValue("published_at");
  });

  it("can change the sort by column", async () => {
    unmount();

    const mockedGet = jest.fn().mockResolvedValue({ data: { data: [] } });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<PostIndex />));

    const sortBy = screen.getByTestId("sort-by");

    await userEvent.selectOptions(sortBy, "created_at");

    expect(mockedGet).toBeCalledWith(
      `${backendUrl}/api/posts?sort_by=created_at`,
    );
  });

  it("can change the sorting direction", async () => {
    unmount();

    const mockedGet = jest.fn().mockResolvedValue({ data: { data: [] } });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<PostIndex />));

    const sortBtn = screen.getByRole("button", { name: /sort/i });

    await userEvent.click(sortBtn);

    expect(mockedGet).toBeCalledWith(`${backendUrl}/api/posts?sort=asc`);
  });
});
