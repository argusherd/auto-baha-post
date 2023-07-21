import { resolveDB } from "@/backend-api/database/connection";
import Post from "@/backend-api/database/entities/Post";
import PostFactory from "@/backend-api/database/factories/PostFactory";

beforeEach(async () => {
  const DB = resolveDB();
  await DB.initialize();
  await DB.runMigrations();
});

test("it can use factory", async () => {
  const beforeCount = await Post.count();

  expect(beforeCount).toEqual(0);

  await new PostFactory().create();

  const afterCount = await Post.count();

  expect(afterCount).toEqual(1);
});
