import { resolveDB } from "@/backend-api/database/connection";
import Post from "@/backend-api/database/entities/Post";
import app from "@/backend-api/index";
import request from "supertest";
import { DataSource } from "typeorm";

describe("the create a new post api", () => {
  let DB: DataSource;

  beforeEach(async () => {
    DB = resolveDB();
    await DB.initialize();
    await DB.runMigrations();
  });

  afterEach(async () => {
    await DB.destroy();
  });

  it("can add new record into the database", async () => {
    const beforeCount = await Post.count();
    expect(beforeCount).toEqual(0);

    await request(app).post("/api/posts").send({
      title: "my first post",
      content: "content in the first post",
    });

    const afterCount = await Post.count();
    expect(afterCount).toEqual(1);
  });

  it("store user's input into the database", async () => {
    await request(app).post("/api/posts").send({
      title: "ma post",
      content: "the content",
    });

    const newPost = await Post.findOneBy({ id: null });

    expect(newPost).toMatchObject({
      title: "ma post",
      content: "the content",
    });
  });

  it("responds to the post that was just saved into the database", async () => {
    const response = await request(app).post("/api/posts").send({
      title: "ma post",
      content: "the content",
    });

    expect(response.body).toMatchObject({
      id: 1,
      title: "ma post",
      content: "the content",
    });
  });

  it("should not allow empty title or empty content", async () => {
    await request(app)
      .post("/api/posts")
      .send({
        title: " ",
        content: "the content",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "title" }] });
      });

    await request(app)
      .post("/api/posts")
      .send({
        title: "the title",
        content: "",
      })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "content" }] })
      );
  });
});
