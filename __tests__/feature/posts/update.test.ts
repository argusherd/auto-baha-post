import Post from "@/backend-api/database/entities/Post";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import request from "supertest";

describe("the update a post api", () => {
  it("can update the details of a post", async () => {
    const post = await new PostFactory().create();

    expect(post.title).not.toEqual("new title");
    expect(post.content).not.toEqual("new content");

    await request(app).put(`/api/posts/${post.id}`).send({
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
      .put(`/api/posts/${post.id}`)
      .send({
        title: "",
        content: "new content",
      })
      .expect(422);

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "new title",
        content: "",
      })
      .expect(422);

    await post.reload();

    expect(post.title).not.toEqual("new title");
    expect(post.content).not.toEqual("new content");
  });

  it("can assign a board to the post", async () => {
    let post = await new PostFactory().create();
    const board = await new BoardFactory().create();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: board.id,
      })
      .expect(200);

    post = await Post.findOne({
      where: { id: post.id },
      relations: { board: true },
    });

    expect(post.board).toEqual(board);
  });

  it("cannot assign a board that doesn't exist to a post", async () => {
    const post = await new PostFactory().create();
    const notExists = 99999;

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: notExists,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });
  });

  it("can unset a post's assignment", async () => {
    let post = await new PostFactory().create();

    expect(post.board).not.toBeNull();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: null,
      })
      .expect(200);

    post = await Post.findOne({
      where: { id: post.id },
      relations: { board: true },
    });

    expect(post.board).toBeNull();
  });
});
