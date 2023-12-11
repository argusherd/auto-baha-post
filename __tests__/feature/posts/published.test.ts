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
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(published.id);
      });
  });

  it("defaults to 10 records per page", async () => {
    const override = {
      updated_at: moment().toISOString(),
      published_at: moment().toISOString(),
    };

    await new PostFactory().createMany(10, override);
    const eleventh = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/published")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    const override = {
      updated_at: moment().toISOString(),
      published_at: moment().toISOString(),
    };

    await new PostFactory().create(override);
    const second = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/published?take=1")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the published posts", async () => {
    const override = {
      updated_at: moment().toISOString(),
      published_at: moment().toISOString(),
    };

    await new PostFactory().createMany(20, override);
    const the21th = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/published?page=3")
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(the21th.id);
      });
  });

  it("should include the assigned board", async () => {
    const published = await new PostFactory().create({
      published_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/published")
      .expect((res) => {
        expect(res.body.data[0].board.id).toEqual(published.board.id);
      });
  });

  it("shows that the type of posts is published", async () => {
    await new PostFactory().create({
      published_at: moment().toISOString(),
    });

    await supertest(app)
      .get("/api/posts/published")
      .expect((res) => {
        expect(res.body.data[0].type).toEqual("published");
      });
  });
});
