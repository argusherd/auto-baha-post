import Post from "@/backend-api/database/entities/Post";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import request from "supertest";

describe("the update a post api", () => {
  it("can update the details of a post", async () => {
    const post = await new PostFactory().create();

    expect(post.title).not.toEqual("new title");
    expect(post.content).not.toEqual("new content");

    await request(app)
      .put(`/api/posts/${[post.id]}`)
      .send({
        title: "new title",
        content: "new content",
      });

    await post.reload();

    expect(post.title).toEqual("new title");
    expect(post.content).toEqual("new content");
  });

  it("cannot update the details of a nonexistent post", async () => {
    const nonExistentId = 9999999;

    await request(app)
      .put(`/api/posts/${nonExistentId}`)
      .send({
        title: "new title",
        content: "new content",
      })
      .expect(404);

    expect(await Post.count()).toEqual(0);
  });

  it("should not allow empty title or empty content", async () => {
    const post = await new PostFactory().create();

    expect(post.title).not.toEqual("new title");
    expect(post.content).not.toEqual("new content");

    await request(app)
      .put(`/api/posts/${[post.id]}`)
      .send({
        title: "",
        content: "new content",
      })
      .expect(422);

    await request(app)
      .put(`/api/posts/${[post.id]}`)
      .send({
        title: "new title",
        content: "",
      })
      .expect(422);

    await post.reload();

    expect(post.title).not.toEqual("new title");
    expect(post.content).not.toEqual("new content");
  });
});
