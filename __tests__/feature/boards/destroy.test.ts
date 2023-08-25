import app from "@/backend-api";
import Board from "@/backend-api/database/entities/Board";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import PostFactory from "@/backend-api/database/factories/PostFactory";
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

  it("cannot delete a board that is been assigned to a post", async () => {
    const board = await new BoardFactory().create();
    await new PostFactory().create({ board });

    await supertest(app).delete(`/api/boards/${board.id}`).expect(409);

    const stillExist = await Board.findOneBy({ id: board.id });

    expect(stillExist).not.toBeNull();
  });
});
