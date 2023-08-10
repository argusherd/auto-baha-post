import "express";
import Board from "./database/entities/Board";
import Post from "./database/entities/Post";

declare module "express" {
  interface Request {
    board?: Board;
    post?: Post;
  }
}
