import { expect, test } from "@playwright/test";
import { launchElectron } from "./setup";

test("it should say hi to us", async () => {
  const app = await launchElectron();
  const page = await app.firstWindow();
  const content = page.getByRole("heading").first();

  await expect(content).toContainText("Hi");
});

test("it can list all tables in the database", async () => {
  const app = await launchElectron();
  const page = await app.firstWindow();
  const content = page.getByRole("listitem").first();

  await expect(content).toContainText("migrations");
});
