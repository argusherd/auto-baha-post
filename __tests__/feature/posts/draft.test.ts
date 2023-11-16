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
});
