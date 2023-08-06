import app from "@/backend-api";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import request from "supertest";

describe("get all boards api", () => {
  it("can retrieve all boards in the db", async () => {
    const boards = await new BoardFactory().createMany(5);

    await request(app)
      .get("/api/boards")
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(5);
        expect(res.body[0]).toMatchObject({
          no: boards[0].no,
          name: boards[0].name,
        });
      });
  });
});
