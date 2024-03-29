import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import Board from "../backend-api/database/entities/Board";
import Post from "../backend-api/database/entities/Post";
import LoginChecker from "./components/LoginChecker";
import PostPropertiesFetcher from "./components/PostPropertiesFetcher";
import PostPublisher from "./components/PostPublisher";
import { createWindow } from "./initialization";

export default function registerIpcMain() {
  ipcMain.on("openBaha", openBaha);
  ipcMain.handle(
    "publishNow",
    async (_event, postId: number) => await publishNow(postId),
  );
  ipcMain.handle("getPostProperties", async (_event, boardId: number) => {
    await getPostProperties(boardId);
  });
  ipcMain.handle("refreshLoginStatus", refreshLoginStatus);
  ipcMain.on("checkUpdate", () => autoUpdater.checkForUpdates());
  ipcMain.on("downloadUpdate", () => autoUpdater.downloadUpdate());
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

async function getPostProperties(boardId: number) {
  const fetcher = new PostPropertiesFetcher();

  fetcher.board = await Board.findOneBy({ id: boardId });

  await fetcher.run();
}

async function refreshLoginStatus() {
  const checker = new LoginChecker();
  await checker.run();
}
