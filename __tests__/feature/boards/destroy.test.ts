import app from "@/backend-api";
import Board from "@/backend-api/database/entities/Board";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import PostFactory from "@/backend-api/database/factories/PostFactory";
import moment from "moment";
import supertest from "supertest";

describe("delete a board api", () => {
  it("can delete a existing board", async () => {
    const board = await new BoardFactory().create();

    await supertest(app).delete(`/api/boards/${board.id}`).expect(200);

    const deleteBoard = await Board.findOneBy({ id: board.id });

    expect(deleteBoard).toBeNull();
  });

  it("cannot delete a board that is not in the db", async () => {
    const notExists = 99999;

    await supertest(app).delete(`/api/boards/${notExists}`).expect(404);
  });

  it("cannot delete a board that has been assigned to a post that is ready to be published", async () => {
    jest.useFakeTimers();

    const board = await new BoardFactory().create();
    await new PostFactory().create({
      board,
      scheduled_at: moment().add(1, "hour").toISOString(),
    });

    await supertest(app).delete(`/api/boards/${board.id}`).expect(409);

    const stillExist = await Board.findOneBy({ id: board.id });

    expect(stillExist).not.toBeNull();

    jest.setSystemTime(moment().add(2, "hours").toDate());

    await supertest(app).delete(`/api/boards/${board.id}`).expect(200);

    const deleted = await Board.findOneBy({ id: board.id });

    expect(deleted).toBeNull();
  });
});
