import { app, BrowserWindow, clipboard } from "electron";
import moment from "moment";
import puppeteer, { Page } from "puppeteer-core";
import pie from "puppeteer-in-electron";
import { AsyncTask } from "toad-scheduler";
import { Between } from "typeorm";
import Post from "../../backend-api/database/entities/Post";

const publishAPost = new AsyncTask("publish a post", async () => {
  console.log("starting task " + moment().utc().format("YYYY-MM-DD HH:mm:ss"));

  const post = await getPost();

  if (!post) return;

  console.log("found one post");

  const browser = await pie.connect(app, puppeteer as any);
  const window = new BrowserWindow();
  const page = await pie.getPage(browser, window);

  await window.loadURL("https://forum.gamer.com.tw");

  // check login
  if (await page.$(".TOP-nologin")) {
    return await failThePublish(post, "USER_IS_NOT_LOGIN", window);
  }

  await setupLocalStorage(window);

  await window.loadURL(
    `https://forum.gamer.com.tw/post1.php?bsn=${post.board.no}&type=1`
  );

  // check board exist
  if (!(await page.$(".c-post__header"))) {
    return await failThePublish(post, "BOARD_NOT_EXISTS", window);
  }

  await page.select(
    "select[name='demonstratioType']",
    String(post.demonstratio)
  );
  await selectSubBoard(page, post);
  await page.select("select[name='subject']", String(post.subject));
  await page.type("input[name='title']", post.title);

  // click out post tips image
  const postTips = await page.$("#postTips");
  const position = await postTips.boundingBox();
  await page.click("#postTips", {
    offset: { x: position.x + 50, y: position.y + 50 },
  });

  clipboard.writeText(post.content);
  window.webContents.paste();

  post.published_at = moment().toISOString();
  await post.save();

  await delay(3000);

  window.destroy();
});

export default publishAPost;

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function getPost() {
  const format = "YYYY-MM-DD HH:mm:ss.SSS";
  const datetime = moment().utc();

  return Post.findOne({
    where: {
      scheduled_at: Between(
        datetime.startOf("minute").format(format),
        datetime.endOf("minute").format(format)
      ),
    },
    relations: {
      board: true,
    },
  });
}

async function failThePublish(
  post: Post,
  reason: string,
  window: BrowserWindow
) {
  post.publish_failed = reason;

  await post.save();

  window.destroy();
}

async function setupLocalStorage(window: BrowserWindow) {
  await window.webContents.executeJavaScript(
    "localStorage.setItem('FOURM_TOUR_vote_apply', 'shown')"
  );
  await window.webContents.executeJavaScript(
    "localStorage.setItem('FOURM_TOUR_comment', 'shown')"
  );
  await window.webContents.executeJavaScript(
    "localStorage.setItem('FOURM_DEMONSTRATIO_HINT', 'shown')"
  );
}

async function selectSubBoard(page: Page, post: Post) {
  const hasOption = await page.$(
    `select[name='nsubbsn'] > option[value='${post.sub_board}']`
  );
  const optionText = await hasOption?.evaluate((el) => el.textContent);

  if (hasOption && !optionText.includes("已鎖定")) {
    return await page.select("select[name='nsubbsn']", String(post.sub_board));
  }

  const fallbackValue = await page.evaluate(() => {
    let options = document.querySelectorAll(`select[name='nsubbsn'] > option`);

    for (let el of options.values()) {
      if (
        el.getAttribute("value") != "0" &&
        !el.textContent.includes("已鎖定")
      ) {
        return el.getAttribute("value");
      }
    }
  });

  await page.select("select[name='nsubbsn']", fallbackValue);
}
