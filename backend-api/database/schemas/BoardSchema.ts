import { EntitySchema } from "typeorm";
import Board from "../entities/Board";

const BoardSchema = new EntitySchema<Board>({
  name: "Board",
  target: Board,
  tableName: "boards",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    no: {
      type: "varchar",
      unique: true,
    },
    name: {
      type: "varchar",
      unique: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
    updated_at: {
      type: "datetime",
      updateDate: true,
    },
  },
});

export default BoardSchema;
