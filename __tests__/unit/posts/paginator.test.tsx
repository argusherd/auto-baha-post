import Paginator from "@/renderer/app/posts/paginator";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

describe("the paginator", () => {
  it("lists the first three pages and the last page", () => {
    render(<Paginator lastPage={10} />);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveTextContent("1");
    expect(links[1]).toHaveTextContent("2");
    expect(links[2]).toHaveTextContent("3");
    expect(links[3]).toHaveTextContent("10");
  });

  it("lists the last three pages and the first page", () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      toString: () => "page=10",
    }));

    render(<Paginator lastPage={10} />);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveTextContent("1");
    expect(links[1]).toHaveTextContent("8");
    expect(links[2]).toHaveTextContent("9");
    expect(links[3]).toHaveTextContent("10");
  });

  it("lists the middle five pages, the first page, and the last page", () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      toString: () => "page=5",
    }));

    render(<Paginator lastPage={10} />);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveTextContent("1");
    expect(links[1]).toHaveTextContent("3");
    expect(links[2]).toHaveTextContent("4");
    expect(links[3]).toHaveTextContent("5");
    expect(links[4]).toHaveTextContent("6");
    expect(links[5]).toHaveTextContent("7");
    expect(links[6]).toHaveTextContent("10");
  });
});
