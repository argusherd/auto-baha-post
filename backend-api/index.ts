import cors from "cors";
import express, { Request, Response } from "express";
import { checkSchema, param, validationResult } from "express-validator";
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

export default app;
