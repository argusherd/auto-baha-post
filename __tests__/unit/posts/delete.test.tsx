import ShowPost from "@/renderer/app/posts/show/page";
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  backendUrl,
  mockedAxios,
  mockParamsGet,
  mockPostPageApi,
  mockRouterPush,
} from "../setup/mock";

describe("delete a post in show a post page", () => {
  const POST_ID = "1";
  const mockedPush = mockRouterPush();
  const mockedDelete = jest.fn().mockResolvedValue({
    status: 200,
  });

  mockParamsGet(POST_ID);
  mockPostPageApi(POST_ID);
  mockedAxios.delete = mockedDelete;
  userEvent.setup();

  beforeEach(async () => {
    await waitFor(() => render(<ShowPost />));
  });

  it("can delete a post when click on delete button", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    expect(mockedDelete).toBeCalled();
    expect(mockedDelete).toBeCalledWith(`${backendUrl}/api/posts/${POST_ID}`);
  });

  it("redirect you to post list page after delete a post", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteBtn);

    expect(mockedPush).toBeCalled();
    expect(mockedPush).toBeCalledWith("/posts");
  });

  it("should prevent default submit event when delete a post", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    const deleteClicked = createEvent.click(deleteBtn);

    fireEvent(deleteBtn, deleteClicked);

    expect(deleteClicked.defaultPrevented).toBeTruthy();
  });
});
