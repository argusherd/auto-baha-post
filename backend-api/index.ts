import cors from "cors";
import express, { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { Not } from "typeorm";
import Board from "./database/entities/Board";
import Post from "./database/entities/Post";
import bindEntity from "./middlewares/route-entity-binding";

const app = express();

app.use(cors());
app.use(express.json());

const validatePost = () =>
  checkSchema(
    {
      title: { trim: true, notEmpty: true },
      content: { notEmpty: true },
    },
    ["body"]
  );

app.get("/api/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

app.get(
  "/api/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    res.json({ ...req.post });
  }
);

app.post("/api/posts", validatePost(), async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const post = new Post();

  ({ title: post.title, content: post.content } = req.body);

  await post.save();

  res.status(201).json({ ...post });
});

app.put(
  "/api/posts/:post",
  bindEntity(Post),
  validatePost(),
  async (req: Request, res: Response) => {
    const post = req.post;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    ({ title: post.title, content: post.content } = req.body);

    await post.save();

    res.status(200).send({ ...post });
  }
);

app.delete(
  "/api/posts/:post",
  bindEntity(Post),
  async (req: Request, res: Response) => {
    const post = req.post;

    await post.remove();

    res.sendStatus(200);
  }
);

const notInUse = (column: string) =>
  async function (value: any) {
    const isUsed = await Board.countBy({ [column]: value });
    return isUsed ? Promise.reject() : Promise.resolve();
  };

const notInUseExcept = (column: string, ignores: number) =>
  async function (value: any) {
    const isUsed = await Board.countBy({ [column]: value, id: Not(ignores) });
    return isUsed ? Promise.reject() : Promise.resolve();
  };

const validateBoard = () =>
  checkSchema(
    {
      no: {
        trim: true,
        notEmpty: true,
        isNumeric: true,
      },
      name: {
        trim: true,
        notEmpty: true,
      },
    },
    ["body"]
  );

app.get("/api/boards", async (_req: Request, res: Response) => {
  res.json(await Board.find());
});

app.post(
  "/api/boards",
  validateBoard(),
  checkSchema({
    no: { custom: { options: notInUse("no"), bail: true } },
    name: { custom: { options: notInUse("name"), bail: true } },
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const board = new Board();

    ({ no: board.no, name: board.name } = req.body);

    try {
      await board.save();

      res.sendStatus(201);
    } catch (error) {
      res.status(422).json({ errors: error });
    }
  }
);

app.put(
  "/api/boards/:board",
  bindEntity(Board),
  validateBoard(),
  async (req: Request, res: Response) => {
    const board = req.board;

    await checkSchema({
      no: {
        custom: { options: notInUseExcept("no", board.id), bail: true },
      },
      name: {
        custom: { options: notInUseExcept("name", board.id), bail: true },
      },
    }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

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
