import { BaseEntity } from "typeorm";

export default class Login extends BaseEntity {
  id: number;
  name?: string;
  account?: string;
  logged_in: boolean;
  created_at: string;
}
