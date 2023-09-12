import { Request, Response, Router } from "express";
import { body } from "express-validator";
import moment from "moment";
import { Between, Not } from "typeorm";
import Board from "../database/entities/Board";
import Post from "../database/entities/Post";
import bindEntity from "../middlewares/route-entity-binding";
import validator from "../middlewares/validate-request";

const router = Router();

const validatePost = [
  body("title").trim().notEmpty(),
  body("content").notEmpty(),
  body("board").if(body("board").notEmpty()).custom(existingBoard),
  body("scheduled_at")
    .isISO8601()
    .isAfter(moment().toISOString())
    .optional({ values: "falsy" }),
  body("board").if(body("scheduled_at").notEmpty()).notEmpty(),
];

router.get("/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

router.get(
  "/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    res.json(req.post);
  }
);

router.post(
  "/posts",
  validator([
    ...validatePost,
    body("scheduled_at").custom(notOverlapped()).optional({ values: "falsy" }),
  ]),
  async (req: Request, res: Response) => {
    const post = new Post();

    ({
      title: post.title,
      content: post.content,
      scheduled_at: post.scheduled_at,
    } = req.body);

    post.board_id = req.body.board || null;

    res.status(201).json(await post.save());
  }
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

    ({
      title: post.title,
      content: post.content,
      scheduled_at: post.scheduled_at,
    } = req.body);

    post.board_id = req.body.board || null;

    res.status(200).json(await post.save());
  }
);

router.delete(
  "/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    await req.post.remove();

    res.sendStatus(200);
  }
);

async function existingBoard(id: number) {
  const isExist = await Board.countBy({ id });

  return isExist ? Promise.resolve() : Promise.reject();
}

function notOverlapped(ignoreId?: number) {
  return async function (value: string) {
    const format = "YYYY-MM-DD HH:mm:ss.SSS";
    const datetime = moment(value).utc();

    const isOverlapped = await Post.countBy({
      scheduled_at: Between(
        datetime.startOf("minute").format(format),
        datetime.endOf("minute").format(format)
      ),
      ...(ignoreId && { id: Not(ignoreId) }),
    });

    return isOverlapped ? Promise.reject() : Promise.resolve();
  };
}

export default router;
