import ViewPost from "@/renderer/app/posts/get/page";
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("axios");
jest.mock("next/navigation");

const POST_ID = 1;
const DOMAIN = "http://localhost";

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedDelete = jest.fn().mockResolvedValue({
  status: 200,
});
mockedAxios.get.mockResolvedValue({
  data: {
    title: "My first post",
    content: "Content in post",
  },
});
mockedAxios.delete = mockedDelete;

(useSearchParams as jest.Mock).mockReturnValue({
  get: () => POST_ID,
});
const mockedPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockedPush,
});

Object.defineProperty(window, "backendUrl", {
  configurable: true,
  value: DOMAIN,
  writable: true,
});

describe("delete a post in get a post page", () => {
  beforeEach(() => {
    userEvent.setup();

    render(<ViewPost />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("can delete a post when click on delete button", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    expect(mockedDelete).toBeCalled();
    expect(mockedDelete).toBeCalledWith(`${DOMAIN}/api/posts/${POST_ID}`);
  });

  it("redirect you to post list page after delete a post", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockedPush).toBeCalled();
      expect(mockedPush).toBeCalledWith("/posts");
    });
  });

  it("should prevent default submit event when delete a post", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    const deleteClicked = createEvent.click(deleteBtn);

    fireEvent(deleteBtn, deleteClicked);

    expect(deleteClicked.defaultPrevented).toBeTruthy();
  });
});
