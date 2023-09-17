import Post from "@/backend-api/database/entities/Post";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import moment from "moment";
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

  it("can optionally set the post's demonstratio, sub_board, and subject", async () => {
    const post = await new PostFactory().create();

    await request(app).put(`/api/posts/${post.id}`).send({
      title: "new title",
      content: "new content",
      demonstratio: 1,
      sub_board: 1,
      subject: 1,
    });

    const updated = await Post.findOneBy({ id: post.id });

    expect(updated.demonstratio).toEqual(1);
    expect(updated.sub_board).toEqual(1);
    expect(updated.subject).toEqual(1);
  });

  it("should set demonstratio, sub_board, and subject as number", async () => {
    const post = await new PostFactory().create();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "new title",
        content: "new content",
        demonstratio: "foobar",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "demonstratio" }] });
      });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "new title",
        content: "new content",
        sub_board: "foobar",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "sub_board" }] });
      });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "new title",
        content: "new content",
        subject: "foobar",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "subject" }] });
      });
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

    await request(app)
      .post("/api/posts")
      .send({
        title: "my first post",
        content: "content in the first post",
        board: 0,
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
        board: "",
      })
      .expect(200);

    post = await Post.findOne({
      where: { id: post.id },
      relations: { board: true },
    });

    expect(post.board).toBeNull();
  });

  it("can schedule the post", async () => {
    const post = await new PostFactory().create();

    const scheduled_at = moment().add(1, "day").toISOString();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: post.board_id,
        scheduled_at,
      })
      .expect(200);

    const scheduled = await Post.findOneBy({ id: post.id });

    expect(moment(scheduled.scheduled_at).toISOString()).toEqual(scheduled_at);
  });

  it("only accept a valid full datetime string when schedule the post", async () => {
    const post = await new PostFactory().create();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: post.board_id,
        scheduled_at: "foobar",
      })
      .expect(422)
      .expect((res) => {
        expect(res.body.errors[0]).toMatchObject({ path: "scheduled_at" });
      });
  });

  it("can only schedule the post after the current time", async () => {
    const post = await new PostFactory().create();

    const lastHour = moment().subtract(1, "hour").toISOString();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: post.board_id,
        scheduled_at: lastHour,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "scheduled_at" }] });
      });
  });

  it("can only schedule the post if it is assigned to a board", async () => {
    const post = await new PostFactory().create();

    const scheduled_at = moment().add(1, "hour").toISOString();

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        board: "",
        scheduled_at,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: post.title,
        content: post.content,
        scheduled_at,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "board" }] });
      });
  });

  it("cannot schedule the same time as other posts besides itself", async () => {
    const baseDateTime = moment().endOf("day");
    const scheduled_at = baseDateTime.toISOString();
    const overlapped = baseDateTime.subtract(1, "minute").toISOString();

    await new PostFactory().create({ scheduled_at: overlapped });

    const post = await new PostFactory().create({ scheduled_at });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "my first post",
        content: "content in the first post",
        board: post.board_id,
        scheduled_at: overlapped,
      })
      .expect(422)
      .expect((res) => {
        expect(res.body).toMatchObject({ errors: [{ path: "scheduled_at" }] });
      });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "my first post",
        content: "content in the first post",
        board: post.board_id,
        scheduled_at,
      })
      .expect(200);
  });

  it("resets the reason for publish failure when rescheduling", async () => {
    const scheduled_at = moment().add(1, "day").toISOString();
    const post = await new PostFactory().create({
      publish_failed: "USER_NOT_LOGIN",
    });

    await request(app)
      .put(`/api/posts/${post.id}`)
      .send({
        title: "my first post",
        content: "content in the first post",
        board: post.board_id,
        scheduled_at,
      })
      .expect(200);

    const updated = await Post.findOneBy({ id: post.id });

    expect(updated.publish_failed).toBeNull();
  });
});
