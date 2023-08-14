import { expect, test } from "@playwright/test";
import { launchElectron } from "./setup";

test("it can open the baha page and allow you to manage authentication", async () => {
  const app = await launchElectron();
  const page = await app.firstWindow();
  const bahaBtn = page.getByRole("button", { name: "Open Baha" });

  await bahaBtn.click();
  await app.context().waitForEvent("page");

  const bahaPage = app.windows()[1];

  expect(app.windows()).toHaveLength(2);
  expect(bahaPage.url()).toContain("gamer.com.tw");
});
