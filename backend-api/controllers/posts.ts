import { Request, Response, Router } from "express";
import { body } from "express-validator";
import Post from "../database/entities/Post";
import bindEntity from "../middlewares/route-entity-binding";
import validator from "../middlewares/validate-request";

const router = Router();

const validatePost = [
  body("title").trim().notEmpty(),
  body("content").notEmpty(),
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
  validator(validatePost),
  async (req: Request, res: Response) => {
    const post = new Post();

    ({ title: post.title, content: post.content } = req.body);

    res.status(201).json(await post.save());
  }
);

router.put(
  "/posts/:post",
  bindEntity(Post),
  validator(validatePost),
  async (req: Request, res: Response) => {
    const post = req.post;

    ({ title: post.title, content: post.content } = req.body);

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

export default router;