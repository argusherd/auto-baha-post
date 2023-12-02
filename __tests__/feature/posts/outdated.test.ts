import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("the outdated posts api", () => {
  it("includes outdated posts", async () => {
    const outdated = await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
    });

    await supertest(app)
      .get("/api/posts/outdated")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(outdated.id);
      });
  });

  it("does not include posts that are not outdated", async () => {
    await new PostFactory().create({
      scheduled_at: moment().add(1, "second").toISOString(),
    });

    await supertest(app)
      .get("/api/posts/outdated")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(0);
      });
  });

  it("does not include posts that have failed to publish or have been published", async () => {
    await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
      publish_failed: "reason",
    }); // failed to publish

    await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
      published_at: moment().toISOString(),
    }); // published

    await supertest(app)
      .get("/api/posts/outdated")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(0);
      });
  });
});
