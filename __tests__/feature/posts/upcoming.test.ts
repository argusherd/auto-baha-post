import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("the upcoming post api", () => {
  it("gets posts that have been scheduled", async () => {
    await new PostFactory().create(); // still in draft

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(scheduled.id);
      });
  });

  it("does not include posts that have been published", async () => {
    await new PostFactory().create({
      published_at: moment().toISOString(),
      scheduled_at: moment().toISOString(),
    }); // published

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(scheduled.id);
      });
  });

  it("does not include posts that have failed to publish", async () => {
    await new PostFactory().create({
      publish_failed: "reason",
      scheduled_at: moment().toISOString(),
    }); // publish failed

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(scheduled.id);
      });
  });

  it("does not include stale posts", async () => {
    await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
    }); // stale

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(scheduled.id);
      });
  });
});
