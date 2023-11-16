import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { t } from "i18next";
import moment from "moment";
import { Between, IsNull, MoreThanOrEqual, Not } from "typeorm";
import Board from "../database/entities/Board";
import Post from "../database/entities/Post";
import bindEntity from "../middlewares/route-entity-binding";
import validator from "../middlewares/validate-request";

const router = Router();

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(() => t("error.not_empty", { column: t("input.title") })),
  body("demonstratio").optional({ values: "falsy" }),
  body("sub_board").optional({ values: "falsy" }),
  body("subject").optional({ values: "falsy" }),
  body("content")
    .notEmpty()
    .withMessage(() => t("error.not_empty", { column: t("input.content") })),
  body("board_id").if(body("board_id").notEmpty()).custom(existingBoard),
  body("scheduled_at")
    .isISO8601()
    .withMessage(() => t("error.not_iso8601"))
    .isAfter(moment().toISOString())
    .withMessage(() =>
      t("error.not_after", {
        value: moment().local().format("YYYY-MM-DD HH:mm"),
      }),
    )
    .optional({ values: "falsy" }),
  body("board_id")
    .if(body("scheduled_at").notEmpty())
    .notEmpty()
    .withMessage(
      () => () => t("error.not_empty", { column: t("input.board") }),
    ),
];

router.get("/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

router.get("/posts/upcoming", async (_req: Request, res: Response) => {
  res.json(
    await Post.findBy({
      scheduled_at: MoreThanOrEqual(
        moment().utc().format("YYYY-MM-DD HH:mm:ss"),
      ),
      published_at: IsNull(),
      publish_failed: IsNull(),
    }),
  );
});

router.get("/posts/draft", async (_req: Request, res: Response) => {
  res.json(
    await Post.findBy({
      scheduled_at: IsNull(),
      published_at: IsNull(),
      publish_failed: IsNull(),
    }),
  );
});

router.get("/posts/published", async (_req: Request, res: Response) => {
  res.json(
    await Post.findBy({
      published_at: Not(IsNull()),
    }),
  );
});

router.get(
  "/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    res.json(req.post);
  },
);

router.post(
  "/posts",
  validator([
    ...validatePost,
    body("scheduled_at").custom(notOverlapped()).optional({ values: "falsy" }),
  ]),
  async (req: Request, res: Response) => {
    const post = new Post();

    setPostDate(post, req);

    res.status(201).json(await post.save());
  },
);

router.put(
  "/posts/:post",
  bindEntity(Post),
  validator(validatePost),
  async (req: Request, ...parameters) => {
    validator([
      body("scheduled_at")
        .custom(notOverlapped(req.post.id))
        .optional({ values: "falsy" }),
    ])(req, ...parameters);
  },
  async (req: Request, res: Response) => {
    const post = req.post;

    setPostDate(post, req);

    res.status(200).json(await post.save());
  },
);

router.delete(
  "/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    await req.post.remove();

    res.sendStatus(200);
  },
);

async function existingBoard(id: number) {
  const isExist = await Board.countBy({ id });

  return isExist
    ? Promise.resolve()
    : Promise.reject(t("error.not_exist", { column: t("input.board") }));
}

function notOverlapped(ignoreId?: number) {
  return async function (value: string) {
    const format = "YYYY-MM-DD HH:mm:ss.SSS";
    const datetime = moment(value).utc();

    const isOverlapped = await Post.countBy({
      scheduled_at: Between(
        datetime.startOf("minute").format(format),
        datetime.endOf("minute").format(format),
      ),
      ...(ignoreId && { id: Not(ignoreId) }),
    });

    return isOverlapped
      ? Promise.reject()
      : Promise.resolve(t("error.not_overlapped"));
  };
}

function setPostDate(post: Post, req: Request) {
  ({
    title: post.title,
    demonstratio: post.demonstratio,
    sub_board: post.sub_board,
    subject: post.subject,
    content: post.content,
    scheduled_at: post.scheduled_at,
  } = req.body);

  post.board_id = req.body.board_id || null;
  post.publish_failed = post.scheduled_at ? null : post.publish_failed;
}

export default router;
