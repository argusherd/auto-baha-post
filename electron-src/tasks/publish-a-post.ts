import { app, BrowserWindow } from "electron";
import moment from "moment";
import puppeteer from "puppeteer-core";
import pie from "puppeteer-in-electron";
import { AsyncTask } from "toad-scheduler";
import { Between } from "typeorm";
import Post from "../../backend-api/database/entities/Post";

const publishAPost = new AsyncTask("publish a post", async () => {
  console.log("starting task " + moment().utc().format("YYYY-MM-DD HH:mm:ss"));

  const post = await getPost();

  if (!post) return console.log("no post found");

  console.log("found one post");

  const browser = await pie.connect(app, puppeteer as any);

  const window = new BrowserWindow();

  await window.loadURL("https://forum.gamer.com.tw");

  const page = await pie.getPage(browser, window);

  if (await page.$(".TOP-nologin")) {
    console.log("user not yet login");
  } else {
    console.log("you have login!");
  }
});

export default publishAPost;

async function getPost() {
  const format = "YYYY-MM-DD HH:mm:ss.SSS";
  const datetime = moment().utc();

  return Post.findOneBy({
    scheduled_at: Between(
      datetime.startOf("minute").format(format),
      datetime.endOf("minute").format(format)
    ),
  });
}
