import { EntitySchema } from "typeorm";
import Post from "../entities/Post";

const PostSchema = new EntitySchema<Post>({
  name: "Post",
  target: Post,
  tableName: "posts",
  columns: {
    id: {
      type: "integer",
      primary: true,
      generated: true,
    },
    board_id: {
      type: "integer",
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
    scheduled_at: {
      type: "datetime",
    },
    published_at: {
      type: "datetime",
    },
    publish_failed: {
      type: "varchar",
    },
  },
  relations: {
    board: {
      type: "many-to-one",
      target: "Board",
      nullable: true,
      joinColumn: {
        name: "board_id",
        referencedColumnName: "id",
      },
    },
  },
});

export default PostSchema;
