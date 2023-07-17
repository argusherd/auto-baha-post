import app from "@/backend-api/index";
import { resolveDB } from "@/electron-src/database/connection";
import Draft from "@/electron-src/database/entities/Draft";
import request from "supertest";
import { DataSource } from "typeorm";

describe("the create a new draft api", () => {
  let DB: DataSource;

  beforeEach(async () => {
    DB = resolveDB();
    await DB.initialize();
    await DB.runMigrations();
  });

  afterEach(async () => {
    await DB.destroy();
  });

  it("can add new record into the database", async () => {
    const beforeCount = await Draft.count();
    expect(beforeCount).toEqual(0);

    await request(app).post("/api/drafts").send({
      subject: "my first draft",
      content: "content in the first draft",
    });

    const afterCount = await Draft.count();
    expect(afterCount).toEqual(1);
  });

  it("store user's input into the database", async () => {
    await request(app).post("/api/drafts").send({
      subject: "ma draft",
      content: "the content",
    });

    const newDraft = await Draft.findOneBy({ id: null });

    expect(newDraft).toMatchObject({
      subject: "ma draft",
      content: "the content",
    });
  });

  it("responds to the draft that was just saved into the database", async () => {
    const response = await request(app).post("/api/drafts").send({
      subject: "ma draft",
      content: "the content",
    });

    expect(response.body).toMatchObject({
      id: 1,
      subject: "ma draft",
      content: "the content",
    });
  });
});
