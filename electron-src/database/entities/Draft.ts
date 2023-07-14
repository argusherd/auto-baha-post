import { BaseEntity } from "typeorm";

export default class Draft extends BaseEntity {
  id: number;
  subject: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
