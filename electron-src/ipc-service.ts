import { ipcMain } from "electron";
import Post from "../backend-api/database/entities/Post";
import PostPublisher from "./components/PostPublisher";
import { createWindow } from "./initialization";

export default function registerIpcMain() {
  ipcMain.on("openBaha", openBaha);
  ipcMain.on(
    "publishNow",
    async (_event, postId: number) => await publishNow(postId)
  );
}

async function openBaha() {
  const window = createWindow();

  await window.loadURL("https://home.gamer.com.tw/homeindex.php");
}

async function publishNow(postId: number) {
  const post = await Post.findOne({
    where: { id: postId },
    relations: { board: true },
  });

  const publisher = new PostPublisher();

  publisher.post = post;

  await publisher.run();
}
