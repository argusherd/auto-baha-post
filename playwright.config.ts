import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  testDir: "__tests__/e2e",
  workers: "50%",
});
