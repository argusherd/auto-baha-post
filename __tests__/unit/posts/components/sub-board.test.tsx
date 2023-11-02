import SubBoard from "@/renderer/app/posts/_posts/sub-board";
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

describe("the sub-board property component", () => {
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
            <SubBoard ref={parentRef} />
          </FormProvider>,
        )),
    );
  });

  it("exposes the getSubBoards method to the parent", async () => {
    expect(parentRef.current).toHaveProperty("getSubBoards");
    expect(parentRef.current.getSubBoards).toBeFunction();
  });

  it("sends an request to retrieve all the sub-boards", async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: [] });
    mockedAxios.get = mockedGet;

    unmount();

    await waitFor(() =>
      render(
        <FormProvider {...formHook}>
          <SubBoard />
        </FormProvider>,
      ),
    );

    expect(mockedGet).toBeCalledWith(backendUrl + "/api/boards/1/sub-boards");
  });

  it("lists all available sub-boards", async () => {
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
          <SubBoard />
        </FormProvider>,
      );
    });

    expect(list).toBeDisabled();
  });
});
