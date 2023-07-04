import { defineConfig } from "@playwright/test";
import { configDotenv } from "dotenv";

const envFilePath = ".env.test";

configDotenv({ path: envFilePath });

export default defineConfig({
  fullyParallel: true,
  testDir: "__tests__/e2e",
  workers: "50%",
});
