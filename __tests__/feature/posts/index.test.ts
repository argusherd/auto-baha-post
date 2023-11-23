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

  it("defaults to 10 records per page", async () => {
    await new PostFactory().createMany(10);
    const eleventh = await new PostFactory().create();

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body).toHaveLength(10);
        expect(res.body.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    await new PostFactory().create();
    const second = await new PostFactory().create();

    await request(app)
      .get("/api/posts?take=1")
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the posts", async () => {
    await new PostFactory().createMany(20);
    const the21th = await new PostFactory().create();

    await request(app)
      .get("/api/posts?page=3")
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(the21th.id);
      });
  });

  it("should include the assigned board", async () => {
    const post = await new PostFactory().create();

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body[0].board.id).toEqual(post.board.id);
      });
  });
});
