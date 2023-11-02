import Demonstratio from "@/renderer/app/posts/_posts/demonstratio";
import "@testing-library/jest-dom";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { MutableRefObject, useRef } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import {
  backendUrl,
  mockedAxios,
  mockPostPageApi,
  renderUseFormHook,
} from "../../setup/mock";

describe("the demonstratio property component", () => {
  let formHook: UseFormReturn;
  let parentRef: MutableRefObject<any>;
  let rerender;
  let unmount;

  beforeEach(async () => {
    ({
      result: { current: parentRef },
    } = renderHook(() => useRef(null)));

    const { setValue } = (formHook = renderUseFormHook());

    mockPostPageApi();
    setValue("board_id", 1);

    await waitFor(
      () =>
        ({ rerender, unmount } = render(
          <FormProvider {...formHook}>
            <Demonstratio ref={parentRef} />
          </FormProvider>,
        )),
    );
  });

  it("exposes the getDemonstratios method to the parent", async () => {
    expect(parentRef.current).toHaveProperty("getDemonstratios");
    expect(parentRef.current.getDemonstratios).toBeFunction();
  });

  it("sends an request to retrieve all the demonstraios", async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: [] });
    mockedAxios.get = mockedGet;

    unmount();

    await waitFor(() =>
      render(
        <FormProvider {...formHook}>
          <Demonstratio />
        </FormProvider>,
      ),
    );

    expect(mockedGet).toBeCalledWith(
      backendUrl + "/api/boards/1/demonstratios",
    );
  });

  it("lists all available demonstratios", async () => {
    const options = screen.getAllByRole("option");

    expect(options[1]).toHaveTextContent("Property 1");
    expect(options[2]).toHaveTextContent("Property 2");
    expect(options[3]).toHaveTextContent("Property 3");
  });

  it("is disabled if there has not been a board assigned", async () => {
    const list = screen.getByRole("combobox");
    const { setValue } = formHook;

    expect(list).toBeEnabled();

    await waitFor(() => {
      setValue("board_id", "");

      rerender(
        <FormProvider {...formHook}>
          <Demonstratio />
        </FormProvider>,
      );
    });

    expect(list).toBeDisabled();
  });
});
