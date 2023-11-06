import ScheduledAt from "@/renderer/app/posts/_posts/scheduled-at";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { FormProvider } from "react-hook-form";
import { renderUseFormHook } from "../../setup/mock";

describe("the scheduled at input", () => {
  it("is disabled if no board is assigned", async () => {
    const methods = renderUseFormHook();
    const { setValue } = methods;

    const { rerender } = render(
      <FormProvider {...methods}>
        <ScheduledAt />
      </FormProvider>,
    );

    expect(screen.getByPlaceholderText("Scheduled At")).toBeDisabled();

    await waitFor(() => {
      setValue("board_id", "1");
      rerender(
        <FormProvider {...methods}>
          <ScheduledAt />
        </FormProvider>,
      );
    });

    expect(screen.getByPlaceholderText("Scheduled At")).toBeEnabled();
  });

  it("displays an error message if there is a scheduled-at error", async () => {
    const methods = renderUseFormHook();
    const { setError } = methods;
    const message = "Something happened";

    const { rerender } = render(
      <FormProvider {...methods}>
        <ScheduledAt />
      </FormProvider>,
    );

    expect(screen.queryByText(message)).not.toBeInTheDocument();

    await waitFor(() => setError("scheduled_at", { message }));
    await waitFor(() =>
      rerender(
        <FormProvider {...methods}>
          <ScheduledAt />
        </FormProvider>,
      ),
    );

    expect(screen.queryByText(message)).toBeInTheDocument();
  });
});
