import { BaseEntity } from "typeorm";
import Board from "./Board";

export default class Post extends BaseEntity {
  id: number;
  board_id?: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  board?: Board;
}
