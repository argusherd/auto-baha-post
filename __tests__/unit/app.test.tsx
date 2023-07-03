import Home from "@/renderer/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

test("it will say hi to us", () => {
  render(<Home />);

  const content = screen.getByRole("heading");

  expect(content).toHaveTextContent("Hi");
});
