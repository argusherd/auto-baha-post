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
