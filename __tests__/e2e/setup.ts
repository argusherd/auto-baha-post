import { _electron as electron } from "@playwright/test";

export async function launchElectron() {
  const port = Number(process.env.API_PORT) + Math.floor(Math.random() * 100);

  return await electron.launch({
    args: ["main/electron-src/index.js"],
    env: {
      ...process.env,
      API_PORT: String(port),
    },
  });
}
