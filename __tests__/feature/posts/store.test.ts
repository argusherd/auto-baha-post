import Post from "@/backend-api/database/entities/Post";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import app from "@/backend-api/index";
import moment from "moment";
import request from "supertest";

describe("the create a new post api", () => {
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

  it("can assign a board during the creating process", async () => {
    const board = await new BoardFactory().create();

    await request(app).post("/api/posts").send({
      title: "my first post",
      content: "content in the first post",
      board: board.id,
    });

    const post = await Post.findOne({ relations: { board: true }, where: {} });

    expect(post.board).toEqual(board);
  });

  it("must be an existing board when provided with a board as an assignment", async () => {
    const notExists = 999999;

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: notExists,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });
  });

  it("is okay to provided an empty board", async () => {
    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: "",
      })
      .expect(201);

    const post = await Post.findOneBy({});

    expect(post.board_id).toBeNull();
  });

  it("can schedule the post during the creating process", async () => {
    const board = await new BoardFactory().create();

    const scheduled_at = moment().add(1, "day").toISOString();

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: board.id,
        scheduled_at,
      })
      .expect(201);

    const post = await Post.findOneBy({});

    expect(moment(post.scheduled_at).toISOString()).toEqual(scheduled_at);
  });

  it("only accept a valid full datetime string", async () => {
    const board = await new BoardFactory().create();

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: board.id,
        scheduled_at: "foorbar",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0]).toMatchObject({ path: "scheduled_at" });
      });
  });

  it("can only schedule the post after the current time", async () => {
    const board = await new BoardFactory().create();

    const yesterday = moment().subtract(1, "day").toISOString();

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: board.id,
        scheduled_at: yesterday,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "scheduled_at" }] });
      });
  });

  it("can only schedule the post if it is assigned to a board", async () => {
    const scheduled_at = moment().add(1, "day").toISOString();

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: "",
        scheduled_at,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        scheduled_at,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });
  });
});
