import { BaseEntity } from "typeorm";
import Board from "../entities/Board";

export default class Demonstratio extends BaseEntity {
  id: number;
  board_id: number;
  value: string;
  text: string;
  created_at: string;
  board: Board;
}
