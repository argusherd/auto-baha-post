import { BaseEntity } from "typeorm";
import Board from "./Board";

export default class Post extends BaseEntity {
  id: number;
  board_id?: number;
  title: string;
  demonstratio?: string;
  sub_board?: string;
  subject?: string;
  content: string;
  created_at: string;
  updated_at: string;
  scheduled_at?: string;
  published_at?: string;
  publish_failed?: string;
  board?: Board;
  type?: string;
}
