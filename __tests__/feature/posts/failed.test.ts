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

  it("defaults to 10 records per page", async () => {
    const override = {
      publish_failed: "reason",
    };

    await new PostFactory().createMany(10, override);
    const eleventh = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/failed")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(10);
        expect(res.body.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    const override = {
      publish_failed: "reason",
    };

    await new PostFactory().create(override);
    const second = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/failed?take=1")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the failed to publish posts", async () => {
    const override = {
      publish_failed: "reason",
    };

    await new PostFactory().createMany(20, override);
    const the21th = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/failed?page=3")
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(the21th.id);
      });
  });

  it("should include the assigned board", async () => {
    const failed = await new PostFactory().create({
      publish_failed: "reason",
    });

    await supertest(app)
      .get("/api/posts/failed")
      .expect((res) => {
        expect(res.body[0].board.id).toEqual(failed.board.id);
      });
  });
});
