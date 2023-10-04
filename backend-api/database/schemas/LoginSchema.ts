import { EntitySchema } from "typeorm";
import Login from "../entities/Login";

const LoginSchema = new EntitySchema<Login>({
  name: "Login",
  target: Login,
  tableName: "logins",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    account: {
      type: "varchar",
      nullable: true,
    },
    logged_in: {
      type: "boolean",
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
  },
});

export default LoginSchema;
