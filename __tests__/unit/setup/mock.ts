import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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

export const mockPostPageApi = (postId: string | number) => {
  mockedAxios.get.mockImplementation(async (url: string) => {
    const request = {
      [backendUrl + "/api/boards"]: {
        data: [
          { id: 1, name: "Tech" },
          { id: 2, name: "Gaming" },
          { id: 3, name: "Cooking" },
        ],
      },
      [backendUrl + `/api/posts/${postId}`]: {
        data: {
          title: "My first post",
          content: "Content in post",
          board_id: 1,
        },
      },
    };

    return request[url];
  });
};
