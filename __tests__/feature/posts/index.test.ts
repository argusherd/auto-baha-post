import PostFactory from "@/backend-api/database/factories/PostFactory";
import app from "@/backend-api/index";
import moment from "moment";
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
        expect(res.body.data).toHaveLength(10);
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
        expect(res.body.data[0]).toMatchObject({
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
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    await new PostFactory().create();
    const second = await new PostFactory().create();

    await request(app)
      .get("/api/posts?take=1")
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the posts", async () => {
    await new PostFactory().createMany(20);
    const the21th = await new PostFactory().create({
      updated_at: moment().subtract(1, "minute").toISOString(), // descending order by default
    });

    await request(app)
      .get("/api/posts?page=3")
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(the21th.id);
      });
  });

  it("should include the assigned board", async () => {
    const post = await new PostFactory().create();

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body.data[0].board.id).toEqual(post.board.id);
      });
  });

  it("orders the list by updated_at in descending order by default", async () => {
    const earlier = await new PostFactory().create({
      updated_at: moment().subtract(1, "minute").toISOString(),
    });
    const later = await new PostFactory().create();

    await request(app)
      .get("/api/posts")
      .expect((res) => {
        expect(res.body.data[0].id).toEqual(later.id);
        expect(res.body.data[1].id).toEqual(earlier.id);
      });
  });

  it("can change the sorting order", async () => {
    const earlier = await new PostFactory().create({
      updated_at: moment().subtract(1, "minute").toISOString(),
    });
    const later = await new PostFactory().create();

    await request(app)
      .get("/api/posts?sort=asc")
      .expect((res) => {
        expect(res.body.data[0].id).toEqual(earlier.id);
        expect(res.body.data[1].id).toEqual(later.id);
      });
  });

  it("can specify the column by which to sort", async () => {
    const scheduledEarlier = await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
    });
    const scheduledLater = await new PostFactory().create({
      updated_at: moment().subtract(1, "minute").toISOString(),
      scheduled_at: moment().toISOString(),
    });

    await request(app)
      .get("/api/posts?sort_by=scheduled_at")
      .expect((res) => {
        expect(res.body.data[0].id).toEqual(scheduledLater.id);
        expect(res.body.data[1].id).toEqual(scheduledEarlier.id);
      });
  });

  it("can paginate the list of posts", async () => {
    await new PostFactory().createMany(30);

    await request(app)
      .get("/api/posts?take=10&page=1")
      .expect((res) => {
        expect(res.body.data).toHaveLength(10);
        expect(res.body.count).toEqual(30);
        expect(res.body.currentPage).toEqual(1);
        expect(res.body.prevPage).toEqual(1);
        expect(res.body.nextPage).toEqual(2);
        expect(res.body.lastPage).toEqual(3);
      });
  });
});
