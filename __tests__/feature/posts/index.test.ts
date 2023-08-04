import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import request from "supertest";

describe("get posts api", () => {
  it("can call the api with no problem", async () => {
    await request(app).get("/api/posts").expect(200);
  });

  it("can get all posts", async () => {
    await new PostFactory().createMany(10);

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body).toHaveLength(10);
      });
  });

  it("can see the detail of posts", async () => {
    await new PostFactory().create({
      title: "my first post",
      content: "content in the post",
    });

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body[0]).toMatchObject({
          title: "my first post",
          content: "content in the post",
        });
      });
  });
});
