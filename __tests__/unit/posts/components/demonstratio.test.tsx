import Demonstratio from "@/renderer/app/posts/_posts/demonstratio";
import "@testing-library/jest-dom";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import {
  backendUrl,
  mockedAxios,
  mockPostPageApi,
  renderUseFormHook,
} from "../../setup/mock";

describe("the demonstratio property component", () => {
  let formHook: UseFormReturn;

  beforeEach(() => {
    formHook = renderUseFormHook();
    const { setValue } = formHook;

    mockPostPageApi();
    setValue("board_id", 1);
  });

  it("exposes the getDemonstratios method to the parent", async () => {
    const refHook = renderHook(() => useRef(null));
    const {
      result: { current: parentRef },
    } = refHook;

    await waitFor(() =>
      render(
        <FormProvider {...formHook}>
          <Demonstratio ref={parentRef} />
        </FormProvider>
      )
    );

    expect(parentRef.current).toHaveProperty("getDemonstratios");
    expect(parentRef.current.getDemonstratios).toBeFunction();
  });

  it("sends an request to retrieve all the demonstraios", async () => {
    const mockedGet = jest.fn().mockResolvedValue({
      data: [],
    });

    mockedAxios.get = mockedGet;

    await waitFor(() =>
      render(
        <FormProvider {...formHook}>
          <Demonstratio />
        </FormProvider>
      )
    );

    expect(mockedGet).toBeCalledWith(
      backendUrl + "/api/boards/1/demonstratios"
    );
  });

  it("lists all available demonstratios", async () => {
    await waitFor(() =>
      render(
        <FormProvider {...formHook}>
          <Demonstratio />
        </FormProvider>
      )
    );

    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveTextContent("Property 1");
    expect(options[1]).toHaveTextContent("Property 2");
    expect(options[2]).toHaveTextContent("Property 3");
  });
});
