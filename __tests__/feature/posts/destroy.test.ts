import Post from "@/backend-api/database/entities/Post";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import request from "supertest";

describe("delete a post api", () => {
  it("can delete a post that exists in the database", async () => {
    const post = await new PostFactory().create();

    await request(app).delete(`/api/posts/${post.id}`).expect(200);

    const deletedPost = await Post.findOneBy({ id: post.id });

    expect(deletedPost).toBeNull();
  });

  it("should not delete a post that does not exist in the database", async () => {
    const notExists = 999999;

    await request(app).delete(`/api/posts/${notExists}`).expect(404);
  });
});
