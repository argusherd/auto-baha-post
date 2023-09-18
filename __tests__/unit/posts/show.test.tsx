import ShowPost from "@/renderer/app/posts/show/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import moment from "moment";
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
  const datetime = moment().toISOString();

  mockParamsGet(POST_ID);

  beforeEach(async () => {
    mockPostPageApi(POST_ID, {
      demonstratio: 1,
      sub_board: 1,
      subject: 1,
      scheduled_at: datetime,
    });

    await waitFor(() => {
      ({ rerender } = render(<ShowPost />));
    });
  });

  it("can view a specified post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const demonstratio = screen.getByPlaceholderText("Demonstratio");
    const subBoard = screen.getByPlaceholderText("Sub Board");
    const subject = screen.getByPlaceholderText("Subject");
    const content = screen.getByPlaceholderText("Content");

    expect(title).toHaveDisplayValue("My first post");
    expect(demonstratio).toHaveValue(1);
    expect(subBoard).toHaveValue(1);
    expect(subject).toHaveValue(1);
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

  it("displays the scheduled time of the post", async () => {
    await waitFor(() => rerender(<ShowPost />));

    const scheduledAt = screen.getByPlaceholderText("Scheduled At");

    expect(scheduledAt).toHaveValue(
      moment(datetime).format("YYYY-MM-DDTHH:mm")
    );
  });
});
