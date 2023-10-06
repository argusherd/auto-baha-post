import app from "@/backend-api";
import LoginFactory from "@/backend-api/database/factories/LoginFactory";
import moment from "moment";
import supertest from "supertest";

describe("check login status api", () => {
  it("get the latest login status checking record", async () => {
    const checkedYesterday = moment().subtract(1, "day").toISOString();
    const checkedToday = moment().toISOString();

    await new LoginFactory().create({ created_at: checkedYesterday });
    await new LoginFactory().create({
      name: "foo",
      account: "bar",
      created_at: checkedToday,
    });

    await supertest(app)
      .get("/api/login/check")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          name: "foo",
          account: "bar",
          logged_in: true,
          created_at: checkedToday,
        });
      });
  });

  it("can indicate that the user is currently not logged in yet", async () => {
    await new LoginFactory().create({
      name: null,
      account: null,
      logged_in: false,
    });

    await supertest(app)
      .get("/api/login/check")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          name: null,
          account: null,
          logged_in: false,
        });
      });
  });

  it("indicates the user is not logged in if there is no records yet", async () => {
    await supertest(app)
      .get("/api/login/check")
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          name: null,
          account: null,
          logged_in: false,
        });
      });
  });
});
