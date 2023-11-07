import CreatePost from "@/renderer/app/posts/create/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import {
  backendUrl,
  mockedAxios,
  mockPostPageApi,
  mockRouterPush,
} from "../setup/mock";

describe("create post page", () => {
  const HTTP_CREATED = 201;
  const mockedPush = mockRouterPush();

  mockedAxios.post.mockResolvedValue({ status: HTTP_CREATED });
  mockPostPageApi();
  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => render(<CreatePost />));
  });

  it("can handle submit event in order to persist post data", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const title = screen.getByPlaceholderText("Title");
    const demonstratio = screen.getByPlaceholderText("Demonstratio");
    const subBoard = screen.getByPlaceholderText("Sub Board");
    const subject = screen.getByPlaceholderText("Subject");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: /save/ });
    const gaming = screen.getByText("Gaming");
    const datetime = moment().format("YYYY-MM-DDTHH:mm");
    const scheduledAt = screen.getByLabelText("Schedule publishing time");

    await userEvent.click(gaming);

    await userEvent.type(title, "My first post");
    await userEvent.selectOptions(demonstratio, "2");
    await userEvent.selectOptions(subBoard, "2");
    await userEvent.selectOptions(subject, "2");
    await userEvent.type(content, "The content in my first post");
    await userEvent.type(scheduledAt, datetime);
    await userEvent.click(submitBtn);

    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(`${backendUrl}/api/posts`, {
      title: "My first post",
      demonstratio: "2",
      sub_board: "2",
      subject: "2",
      content: "The content in my first post",
      board_id: 2,
      scheduled_at: datetime,
    });
  });

  it("resets input fields after submit create a post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: /save/ });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    expect(title).toHaveDisplayValue("");
    expect(content).toHaveDisplayValue("");
  });

  it("redirect you to all posts page after successfully create a post", async () => {
    const title = screen.getByPlaceholderText("Title");
    const content = screen.getByPlaceholderText("Content");
    const submitBtn = screen.getByRole("button", { name: /save/ });

    await userEvent.type(title, "My first post");
    await userEvent.type(content, "The content in my first post");
    await userEvent.click(submitBtn);

    expect(mockedPush).toBeCalledTimes(1);
    expect(mockedPush).toBeCalledWith("/posts");
  });

  it("reminds you if the inputs are changed (dirty)", async () => {
    expect(screen.queryByTestId("is-dirty")).not.toBeInTheDocument();

    const title = screen.getByPlaceholderText("Title");

    await userEvent.type(title, "new");

    expect(screen.queryByTestId("is-dirty")).toBeInTheDocument();
  });
});
