import { EntitySchema } from "typeorm";
import Post from "../entities/Post";

const PostSchema = new EntitySchema({
  name: "Post",
  target: Post,
  tableName: "posts",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    title: {
      type: "varchar",
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

export default PostSchema;
