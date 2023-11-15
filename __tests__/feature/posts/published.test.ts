import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("the published posts api", () => {
  it("gets posts that have been published", async () => {
    await new PostFactory().create(); // still in draft

    const published = await new PostFactory().create({
      published_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/published")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(published.id);
      });
  });
});
