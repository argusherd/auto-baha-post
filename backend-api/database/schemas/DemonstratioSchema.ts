import { EntitySchema } from "typeorm";
import Demonstratio from "../entities/Demonstratio";

const DemonstratioSchema = new EntitySchema<Demonstratio>({
  name: "Demonstratio",
  target: Demonstratio,
  tableName: "demonstratios",
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

export default DemonstratioSchema;
