import { BaseEntity } from "typeorm";

export default class Post extends BaseEntity {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
