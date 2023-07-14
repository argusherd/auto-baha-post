import { EntitySchema } from "typeorm";
import Draft from "../entities/Draft";

const DraftSchema = new EntitySchema({
  name: "Draft",
  target: Draft,
  tableName: "drafts",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    subject: {
      type: "text",
    },
    content: {
      type: "text",
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

export default DraftSchema;
