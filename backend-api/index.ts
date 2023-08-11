import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Not } from "typeorm";
import Board from "./database/entities/Board";
import Post from "./database/entities/Post";
import bindEntity from "./middlewares/route-entity-binding";
import validator from "./middlewares/validate-request";

const app = express();

app.use(cors());
app.use(express.json());

const validatePost = [
  body("title").trim().notEmpty(),
  body("content").notEmpty(),
];

app.get("/api/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

app.get(
  "/api/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    res.json(req.post);
  }
);

app.post(
  "/api/posts",
  validator(validatePost),
  async (req: Request, res: Response) => {
    const post = new Post();

    ({ title: post.title, content: post.content } = req.body);

    await post.save();

    res.status(201).json(post);
  }
);

app.put(
  "/api/posts/:post",
  bindEntity(Post),
  validator(validatePost),
  async (req: Request, res: Response) => {
    const post = req.post;

    ({ title: post.title, content: post.content } = req.body);

    await post.save();

    res.status(200).json(post);
  }
);

app.delete(
  "/api/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    await req.post.remove();

    res.sendStatus(200);
  }
);

const notInUse = (column: string, ignoreId?: number) =>
  async function (value: any) {
    const isUsed = await Board.countBy({
      [column]: value,
      ...(ignoreId && { id: Not(ignoreId) }),
    });

    return isUsed ? Promise.reject() : Promise.resolve();
  };

const validateBoard = [
  body("no").trim().notEmpty().isNumeric(),
  body("name").trim().notEmpty(),
];

app.get("/api/boards", async (_req: Request, res: Response) => {
  res.json(await Board.find());
});

app.post(
  "/api/boards",
  validator([
    ...validateBoard,
    body("no").custom(notInUse("no")),
    body("name").custom(notInUse("name")),
  ]),
  async (req: Request, res: Response) => {
    const board = new Board();

    ({ no: board.no, name: board.name } = req.body);

    await board.save();

    res.status(201).json(board);
  }
);

app.put(
  "/api/boards/:board",
  bindEntity(Board),
  validator(validateBoard),
  (req: Request, res: Response, next: NextFunction) => {
    validator([
      body("no").custom(notInUse("no", req.board.id)),
      body("name").custom(notInUse("name", req.board.id)),
    ])(req, res, next);
  },
  async (req: Request, res: Response) => {
    const board = req.board;

    ({ no: board.no, name: board.name } = req.body);

    await board.save();

    res.json(board);
  }
);

app.delete(
  "/api/boards/:board",
  bindEntity(Board),
  async (req: Request, res: Response) => {
    const board = req.board;

    await board.remove();

    res.sendStatus(200);
  }
);

export default app;
