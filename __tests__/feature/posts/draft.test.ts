import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("in draft posts api", () => {
  it("gets posts that still in draft", async () => {
    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    }); // upcoming

    const inDraft = await new PostFactory().create();

    await supertest(app)
      .get("/api/posts/draft")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(inDraft.id);
      });
  });

  it("only includes posts that have not been scheduled, published, or failed to publish", async () => {
    await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    }); // upcoming

    await new PostFactory().create({
      published_at: moment().toISOString(),
    }); // published

    await new PostFactory().create({
      publish_failed: "reason",
    }); // failed to publish

    const inDraft = await new PostFactory().create();

    await supertest(app)
      .get("/api/posts/draft")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(inDraft.id);
      });
  });

  it("defaults to 10 records per page", async () => {
    await new PostFactory().createMany(10);
    const eleventh = await new PostFactory().create();

    await supertest(app)
      .get("/api/posts/draft")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(10);
        expect(res.body.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    await new PostFactory().create();
    const second = await new PostFactory().create();

    await supertest(app)
      .get("/api/posts/draft?take=1")
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the draft posts", async () => {
    await new PostFactory().createMany(20);
    const the21th = await new PostFactory().create();

    await supertest(app)
      .get("/api/posts/draft?page=3")
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(the21th.id);
      });
  });
});
