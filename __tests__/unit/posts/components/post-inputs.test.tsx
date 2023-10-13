import PostInputs from "@/renderer/app/posts/_posts/post-inputs";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { mockedAxios, renderUseFormHook } from "../../setup/mock";

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

  it("has a input field for the title", async () => {
    const titleInput = screen.queryByPlaceholderText("Title");

    expect(titleInput).toBeInTheDocument();

    await userEvent.type(titleInput, "Hello world");

    expect(titleInput).toHaveDisplayValue("Hello world");
  });

  it("has a input field for the content", async () => {
    const contentInput = screen.queryByPlaceholderText("Content");

    expect(contentInput).toBeInTheDocument();

    await userEvent.type(contentInput, "Hello world");

    expect(contentInput).toHaveDisplayValue("Hello world");
  });

  test("all required inputs should be filled", async () => {
    const submit = screen.getByTestId("submit");

    await userEvent.click(submit);
    await waitFor(rerenderPostInputs);

    const titleError = screen.queryByText("Title is required");
    const contentError = screen.queryByText("Content is required");

    expect(titleError).toBeInTheDocument();
    expect(contentError).toBeInTheDocument();
  });

  it("can schedule the post after it is assigning a board", async () => {
    const gaming = screen.getByText("Gaming");
    let scheduledAt = screen.queryByLabelText("Schedule");

    expect(scheduledAt).not.toBeInTheDocument();

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);

    scheduledAt = screen.queryByLabelText("Schedule");

    expect(scheduledAt).toBeInTheDocument();
  });

  it("can refresh the post properties list", async () => {
    const mockedGetPostProperties = jest.fn();
    const gaming = screen.getByText("Gaming");

    window.electron.getPostProperties = mockedGetPostProperties;

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);

    const refresh = screen.getByRole("button", { name: "Refresh" });

    await userEvent.click(refresh);

    expect(mockedGetPostProperties).toBeCalledWith(2);
  });

  it("can refresh the post properties only if it is assigned to a board", async () => {
    const gaming = screen.getByText("Gaming");
    const refresh = screen.getByRole("button", { name: "Refresh" });

    expect(refresh).toBeDisabled();

    await userEvent.click(gaming);
    await waitFor(rerenderPostInputs);

    expect(refresh).toBeEnabled();
  });
});
