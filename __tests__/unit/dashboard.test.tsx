import i18next from "@/i18n";
import Dashboard from "@/renderer/app/page";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import moment from "moment";
import { backendUrl, mockedAxios } from "./setup/mock";

describe("the dashboard page", () => {
  it("displays 4 types of sections", async () => {
    mockedAxios.get = jest.fn().mockResolvedValue({ data: { data: [] } });

    await waitFor(() => render(<Dashboard />));
    const upcoming = screen.getByRole("link", {
      name: i18next.t("page.upcoming"),
    });
    const failed = screen.getByRole("link", { name: i18next.t("page.failed") });
    const draft = screen.getByRole("link", { name: i18next.t("page.draft") });
    const published = screen.getByRole("link", {
      name: i18next.t("page.published"),
    });

    expect(upcoming).toHaveAttribute("href", "/posts?type=upcoming");
    expect(failed).toHaveAttribute("href", "/posts?type=failed");
    expect(draft).toHaveAttribute("href", "/posts?type=draft");
    expect(published).toHaveAttribute("href", "/posts?type=published");
  });

  it("shows the upcoming post", async () => {
    const timestamp = moment();
    const mockedGet = jest.fn().mockImplementation((url: string) => {
      if (!url.includes("/upcoming")) return { data: { data: [] } };

      return {
        data: {
          data: [
            {
              id: 1,
              title: "The upcoming post",
              scheduled_at: timestamp.toISOString(),
            },
          ],
        },
      };
    });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<Dashboard />));

    const title = screen.getByRole("heading", { level: 4 });
    const scheduledAt = screen.getByTestId("scheduled_at");

    expect(title).toHaveTextContent("The upcoming post");
    expect(scheduledAt).toHaveTextContent(
      i18next.t("post.scheduled_at", { scheduled_at: timestamp.fromNow() }),
    );

    expect(mockedGet).toBeCalledWith(`${backendUrl}/api/posts/upcoming?take=1`);
  });

  it("shows the failed to publish post", async () => {
    const mockedGet = jest.fn().mockImplementation((url: string) => {
      if (!url.includes("/failed")) return { data: { data: [] } };

      return {
        data: {
          data: [
            {
              id: 1,
              title: "The failed to publish post",
              publish_failed: "reason",
            },
          ],
        },
      };
    });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<Dashboard />));

    const title = screen.getByRole("heading", { level: 4 });
    const publishFailed = screen.getByTestId("publish_failed");

    expect(title).toHaveTextContent("The failed to publish post");
    expect(publishFailed).toHaveTextContent("reason");

    expect(mockedGet).toBeCalledWith(`${backendUrl}/api/posts/failed?take=1`);
  });

  it("shows the post that still in draft", async () => {
    const timestamp = moment();
    const mockedGet = jest.fn().mockImplementation((url: string) => {
      if (!url.includes("/draft")) return { data: { data: [] } };

      return {
        data: {
          data: [
            {
              id: 1,
              title: "The post that still in draft",
              updated_at: timestamp.toISOString(),
            },
          ],
        },
      };
    });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<Dashboard />));

    const title = screen.getByRole("heading", { level: 4 });
    const updatedAt = screen.getByTestId("updated_at");

    expect(title).toHaveTextContent("The post that still in draft");
    expect(updatedAt).toHaveTextContent(
      i18next.t("post.updated_at", { updated_at: timestamp.fromNow() }),
    );

    expect(mockedGet).toBeCalledWith(`${backendUrl}/api/posts/draft?take=1`);
  });

  it("shows the post that already published", async () => {
    const timestamp = moment();
    const mockedGet = jest.fn().mockImplementation((url: string) => {
      if (!url.includes("/published")) return { data: { data: [] } };

      return {
        data: {
          data: [
            {
              id: 1,
              title: "The post that already published",
              published_at: timestamp.toISOString(),
            },
          ],
        },
      };
    });

    mockedAxios.get = mockedGet;

    await waitFor(() => render(<Dashboard />));

    const title = screen.getByRole("heading", { level: 4 });
    const publishedAt = screen.getByTestId("published_at");

    expect(title).toHaveTextContent("The post that already published");
    expect(publishedAt).toHaveTextContent(
      i18next.t("post.published_at", { published_at: timestamp.fromNow() }),
    );

    expect(mockedGet).toBeCalledWith(
      `${backendUrl}/api/posts/published?take=1`,
    );
  });
});
