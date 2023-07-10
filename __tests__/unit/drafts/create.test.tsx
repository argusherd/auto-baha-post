import CreateDraft from "@/renderer/app/drafts/create/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("create draft page", () => {
  beforeEach(() => {
    userEvent.setup();

    render(<CreateDraft />);
  });

  test("it has a input field for the subject", async () => {
    const subjectInput = screen.queryByPlaceholderText("Subject");

    expect(subjectInput).toBeInTheDocument();

    await userEvent.type(subjectInput, "Hello world");

    expect(subjectInput).toHaveDisplayValue("Hello world");
  });

  test("it has a input field for the content", async () => {
    const contentInput = screen.queryByPlaceholderText("Content");

    expect(contentInput).toBeInTheDocument();

    await userEvent.type(contentInput, "Hello world");

    expect(contentInput).toHaveDisplayValue("Hello world");
  });

  test("all inputs should be filled", async () => {
    const submitButton = screen.getByRole("button", { name: "Save" });

    await userEvent.click(submitButton);

    const subjectError = screen.queryByText("Subject is required");
    const contentError = screen.queryByText("Content is required");

    await waitFor(() => {
      expect(subjectError).toBeInTheDocument();
      expect(contentError).toBeInTheDocument();
    });
  });
});
