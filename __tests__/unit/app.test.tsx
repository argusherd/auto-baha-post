import Home from "@/renderer/app/page";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

test("it will say hi to us", async () => {
  const { findByRole } = render(<Home />);

  const content = await findByRole("heading");

  expect(content).toHaveTextContent("Hi");
});
