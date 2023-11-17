import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import supertest from "supertest";

describe("failed posts api", () => {
  it("gets posts that failed to publish", async () => {
    await new PostFactory().create(); // in draft

    const failed = await new PostFactory().create({
      publish_failed: "reason",
    });

    await supertest(app)
      .get("/api/posts/failed")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(failed.id);
      });
  });
});
