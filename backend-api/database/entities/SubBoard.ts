import { BaseEntity } from "typeorm";
import Board from "./Board";

export default class SubBoard extends BaseEntity {
  id: number;
  board_id: number;
  value: string;
  text: string;
  created_at: string;
  board: Board;
}
