import { resolveDB } from "@/backend-api/database/connection";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import request from "supertest";

describe("get a post api", () => {
  const DB = resolveDB();

  beforeEach(async () => {
    await DB.initialize();
    await DB.runMigrations();
  });

  afterEach(async () => {
    await DB.destroy();
  });

  it("can retrieve a specified post data", async () => {
    const post = await new PostFactory().create();

    await request(app)
      .get(`/api/posts/${post.id}`)
      .expect(200)
      .expect((res) => {
        const { id, title, content } = res.body;

        expect(id).toEqual(post.id);
        expect(title).toEqual(post.title);
        expect(content).toEqual(post.content);
      });
  });

  it("cannot retrieve a post that not exists in the database", async () => {
    const notExists = 999999;

    await request(app).get(`/api/posts/${notExists}`).expect(404);
  });
});
