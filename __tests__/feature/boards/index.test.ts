import app from "@/backend-api";
import Board from "@/backend-api/database/entities/Board";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import request from "supertest";

describe("get all boards api", () => {
  it("can retrieve all boards in the db", async () => {
    await new BoardFactory().createMany(5);
    const board = await Board.findOneBy({});

    await request(app)
      .get("/api/boards")
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThanOrEqual(5);
        expect(res.body[0].id).toEqual(board.id);
        expect(res.body[0].no).toEqual(board.no);
        expect(res.body[0].name).toEqual(board.name);
      });
  });
});
