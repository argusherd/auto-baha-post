import Post from "@/backend-api/database/entities/Post";
import { renderHook } from "@testing-library/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export const backendUrl = "http://backend-api.test";

export const mockedAxios = axios as jest.Mocked<typeof axios>;

export const mockRouterPush = () => {
  const mockedPush = jest.fn();

  (useRouter as jest.Mock).mockReturnValue({
    push: mockedPush,
  });

  return mockedPush;
};

export const mockParamsGet = (param: string) =>
  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => param,
  });

export const mockPostPageApi = (
  postId?: string | number,
  postData?: object | Post
) => {
  mockedAxios.get.mockImplementation(async (url: string) => {
    if (url === backendUrl + "/api/boards")
      return {
        data: [
          { id: 1, name: "Tech" },
          { id: 2, name: "Gaming" },
          { id: 3, name: "Cooking" },
        ],
      };

    if (url === backendUrl + `/api/posts/${postId}`)
      return {
        data: {
          title: "My first post",
          content: "Content in post",
          board_id: 1,
          ...postData,
        },
      };

    if (url.endsWith("/demonstratios") || url.endsWith("/sub-boards")) {
      return {
        data: [
          { id: 1, value: "1", text: "Property 1" },
          { id: 2, value: "2", text: "Property 2" },
          { id: 3, value: "3", text: "Property 3" },
        ],
      };
    }
  });
};

export const renderUseFormHook = () => {
  const {
    result: { current },
  } = renderHook(() => useForm());

  return current;
};
