import cors from "cors";
import express, { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import Post from "./database/entities/Post";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/posts", async (_req: Request, res: Response) => {
  res.json(await Post.find());
});

app.post(
  "/api/posts",
  checkSchema(
    {
      title: { trim: true, notEmpty: true },
      content: { notEmpty: true },
    },
    ["body"]
  ),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const post = new Post();

    ({ title: post.title, content: post.content } = req.body);

    await post.save();

    res.status(201).json({ ...post });
  }
);

export default app;
