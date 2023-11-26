import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { t } from "i18next";
import moment from "moment";
import {
  Between,
  FindOptionsOrderValue,
  FindOptionsWhere,
  IsNull,
  MoreThanOrEqual,
  Not,
} from "typeorm";
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

router.get("/posts", async (req: Request, res: Response) => {
  res.json(await paginator({}, req));
});

router.get("/posts/upcoming", async (req: Request, res: Response) => {
  res.json(
    await paginator(
      {
        scheduled_at: MoreThanOrEqual(
          moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        ),
        published_at: IsNull(),
        publish_failed: IsNull(),
      },
      req,
    ),
  );
});

router.get("/posts/failed", async (req: Request, res: Response) => {
  res.json(
    await paginator(
      {
        publish_failed: Not(IsNull()),
      },
      req,
    ),
  );
});

router.get("/posts/draft", async (req: Request, res: Response) => {
  res.json(
    await paginator(
      {
        scheduled_at: IsNull(),
        published_at: IsNull(),
        publish_failed: IsNull(),
      },
      req,
    ),
  );
});

router.get("/posts/published", async (req: Request, res: Response) => {
  res.json(
    await paginator(
      {
        published_at: Not(IsNull()),
      },
      req,
    ),
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
  } = req.body);

  post.board_id = req.body.board_id || null;
  post.scheduled_at = req.body.scheduled_at || null;
  post.publish_failed = post.scheduled_at ? null : post.publish_failed;
}

function paginator(where: FindOptionsWhere<Post>, req: Request) {
  const take = Number(req.query.take || 10);
  const skip = (Number(req.query.page || 1) - 1) * take;
  const sortBy = (req.query.sort_by || "updated_at") as string;
  const sort = (req.query.sort || "desc") as FindOptionsOrderValue;

  return Post.find({
    where,
    take,
    skip,
    relations: { board: true },
    order: { [sortBy]: sort },
  });
}

export default router;
