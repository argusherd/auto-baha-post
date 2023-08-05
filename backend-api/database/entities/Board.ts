import { BaseEntity } from "typeorm";

export default class Board extends BaseEntity {
  id: number;
  no: string;
  name: string;
  created_at: string;
  updated_at: string;
}
