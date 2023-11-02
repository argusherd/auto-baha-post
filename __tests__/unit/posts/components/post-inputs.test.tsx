import PostInputs from "@/renderer/app/posts/_posts/post-inputs";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { mockedAxios, renderUseFormHook } from "../../setup/mock";

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn().mockImplementation(() => ({
    current: {
      getDemonstratios: jest.fn(),
      getSubBoards: jest.fn(),
    },
  }));
  return {
    ...originReact,
    useRef: mUseRef,
    useImperativeHandle: jest.fn(),
  };
});

describe("the post-inputs component", () => {
  let formHook: UseFormReturn;
  let rerender;

  const postInputs = () => {
    const { handleSubmit } = formHook;
    return (
      <FormProvider {...formHook}>
        <form onSubmit={handleSubmit(() => {})}>
          <PostInputs />
          <button data-testid="submit"></button>
        </form>
      </FormProvider>
    );
  };
  const rerenderPostInputs = () => rerender(postInputs());

  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: "Tech" },
      { id: 2, name: "Gaming" },
    ],
  });

  beforeEach(async () => {
    formHook = renderUseFormHook();

    await waitFor(() => ({ rerender } = render(postInputs())));
  });

  test("all required inputs should be filled and not a blank string", async () => {
    const inputTitle = screen.getByPlaceholderText("Title");
    const inputContent = screen.getByPlaceholderText("Content");
    const submit = screen.getByTestId("submit");

    await userEvent.type(inputTitle, "  ");
    await userEvent.type(inputContent, "  ");
    await userEvent.click(submit);
    await waitFor(rerenderPostInputs);

    const titleError = screen.queryByText("Title should not be empty.");
    const contentError = screen.queryByText("Content should not be empty.");

    expect(titleError).toBeInTheDocument();
    expect(contentError).toBeInTheDocument();
  });

  it("can schedule the post after it is assigning a board", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");
    const scheduledAt = screen.getByPlaceholderText("Scheduled At");

    expect(scheduledAt).toBeDisabled();

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);

    expect(scheduledAt).toBeEnabled();
  });

  it("can refresh the post properties list", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const mockedGetPostProperties = jest.fn();
    const gaming = screen.getByText("Gaming");
    const refresh = screen.getByRole("button", { name: /refresh/ });

    window.electron.getPostProperties = mockedGetPostProperties;

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);
    await userEvent.click(refresh);

    expect(mockedGetPostProperties).toBeCalledWith(2);
  });

  it("can refresh the post properties only if it is assigned to a board", async () => {
    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");
    const refresh = screen.getByRole("button", { name: /refresh/ });

    expect(refresh).toBeDisabled();

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);

    expect(refresh).toBeEnabled();
  });

  it("calls children's function to retrieve the post properties after clicking the refresh button", async () => {
    const mockedGetDemonstratios = jest.fn();
    const mockedGetSubBoards = jest.fn();

    Object.defineProperty(React, "useRef", {
      value: jest.fn().mockReturnValue({
        current: {
          getDemonstratios: mockedGetDemonstratios,
          getSubBoards: mockedGetSubBoards,
        },
      }),
    });

    await userEvent.click(screen.getByRole("heading"));

    const gaming = screen.getByText("Gaming");
    const refresh = screen.getByRole("button", { name: /refresh/ });

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);
    await userEvent.click(refresh);

    expect(mockedGetDemonstratios).toBeCalled();
    expect(mockedGetSubBoards).toBeCalled();
  });

  it("can insert an emoji to the content textarea", async () => {
    const emoji = screen.getAllByRole("img")[0];
    const content = screen.queryByPlaceholderText("Content");

    await userEvent.click(emoji);

    expect(content).toHaveDisplayValue(
      "https://i2.bahamut.com.tw/editor/emotion/1.gif" + "\n",
    );
  });

  it("does not reset fields other than those in the create board form after creating a new board", async () => {
    mockedAxios.post = jest.fn();

    await userEvent.click(screen.getByRole("heading"));

    const title = screen.getByPlaceholderText("Title");
    const boardName = screen.getByPlaceholderText("Board name");
    const boardNo = screen.getByPlaceholderText("Board serial number");
    const createBtn = screen.getByRole("button", { name: "create-board" });

    await userEvent.type(title, "New post");
    await userEvent.type(boardName, "Foobar");
    await userEvent.type(boardNo, "123456");
    await userEvent.click(createBtn);

    expect(title).toHaveDisplayValue("New post");
  });
});
