import { EntitySchema } from "typeorm";
import SubBoard from "../entities/SubBoard";

const SubBoardSchema = new EntitySchema<SubBoard>({
  name: "SubBoard",
  target: SubBoard,
  tableName: "sub_boards",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    board_id: {
      type: "integer",
    },
    value: {
      type: "varchar",
      nullable: true,
    },
    text: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
  },
  relations: {
    board: {
      type: "many-to-one",
      target: "Board",
      joinColumn: {
        name: "board_id",
        referencedColumnName: "id",
      },
    },
  },
});

export default SubBoardSchema;
