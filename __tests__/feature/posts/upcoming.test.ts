import app from "@/backend-api";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("the upcoming post api", () => {
  it("gets posts that have been scheduled", async () => {
    await new PostFactory().create(); // still in draft

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().add(1, "minute").toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(scheduled.id);
      });
  });

  it("does not include outdated posts", async () => {
    await new PostFactory().create({
      scheduled_at: moment().subtract(1, "minute").toISOString(),
    }); // outdated

    const scheduled = await new PostFactory().create({
      scheduled_at: moment().add(1, "minute").toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(scheduled.id);
      });
  });

  it("defaults to 10 records per page", async () => {
    const override = {
      updated_at: moment().toISOString(),
      scheduled_at: moment().add(1, "minute").toISOString(),
    };

    await new PostFactory().createMany(10, override);
    const eleventh = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(10);
        expect(res.body.data.map((item) => item.id)).not.toContain(eleventh.id);
      });
  });

  it("can determine the number of records to list per page", async () => {
    const override = {
      updated_at: moment().toISOString(),
      scheduled_at: moment().add(1, "minute").toISOString(),
    };

    await new PostFactory().create(override);
    const second = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/upcoming?take=1")
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data.map((item) => item.id)).not.toContain(second.id);
      });
  });

  it("can paginate all the upcoming posts", async () => {
    const override = {
      updated_at: moment().toISOString(),
      scheduled_at: moment().add(1, "minute").toISOString(),
    };

    await new PostFactory().createMany(20, override);
    const the21th = await new PostFactory().create(override);

    await supertest(app)
      .get("/api/posts/upcoming?page=3")
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].id).toEqual(the21th.id);
      });
  });

  it("should include the assigned board", async () => {
    const scheduled = await new PostFactory().create({
      scheduled_at: moment().add(1, "minute").toISOString(),
    });

    await supertest(app)
      .get("/api/posts/upcoming")
      .expect((res) => {
        expect(res.body.data[0].board.id).toEqual(scheduled.board.id);
      });
  });
});
