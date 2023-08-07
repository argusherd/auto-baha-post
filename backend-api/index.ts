import cors from "cors";
import express, { Request, Response } from "express";
import { checkSchema, param, validationResult } from "express-validator";
import { Not } from "typeorm";
import Board from "./database/entities/Board";
import Post from "./database/entities/Post";

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

const checkPostExists = () =>
  param("post").customSanitizer(
    async (id) => await Post.findOneBy({ id: Number(id) })
  );

app.get("/api/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

app.get(
  "/api/posts/:post",
  checkPostExists(),
  async (req: Request<{ post: Post }>, res: Response) => {
    const post = req.params.post;

    if (!post) return res.sendStatus(404);

    return res.json({ ...post });
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
  checkPostExists(),
  validatePost(),
  async (req: Request<{ post: Post }>, res: Response) => {
    const post = req.params.post;

    if (!post) return res.sendStatus(404);

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
  checkPostExists(),
  async (req: Request<{ post: Post }>, res: Response) => {
    const post = req.params.post;

    if (!post) return res.sendStatus(404);

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

const boardBinding = () =>
  param("board").customSanitizer(
    async (id: number) => await Board.findOneBy({ id })
  );

app.put(
  "/api/boards/:board",
  boardBinding(),
  validateBoard(),
  async (req: Request<{ board: Board }, any, Board>, res: Response) => {
    const board = req.params.board;

    if (!board) return res.sendStatus(404);

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

export default app;
