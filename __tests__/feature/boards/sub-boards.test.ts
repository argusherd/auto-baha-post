import app from "@/backend-api";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import SubBoardFactory from "@/backend-api/database/factories/SubBoardFactory";
import supertest from "supertest";

describe("the available sub-boards for posts api", () => {
  it("needs a board in order to get the sub-boards", async () => {
    const board = await new BoardFactory().create();

    await supertest(app).get("/api/boards/NOT_EXISTS/sub-boards").expect(404);

    await supertest(app).get(`/api/boards/${board.id}/sub-boards`).expect(200);
  });

  it("can get the sub-boards that available for posts", async () => {
    const subBoard = await new SubBoardFactory().create();

    await supertest(app)
      .get(`/api/boards/${subBoard.board_id}/sub-boards`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].value).toEqual(subBoard.value);
        expect(res.body[0].text).toEqual(subBoard.text);
      });
  });

  it("excludes the sub-board that value equals to 0", async () => {
    const equals0 = await new SubBoardFactory().create({
      value: "0",
    });

    await supertest(app)
      .get(`/api/boards/${equals0.board_id}/sub-boards`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(0);
      });
  });

  it("excludes the sub-board that text contains 已鎖定", async () => {
    const isLocked = await new SubBoardFactory().create({
      text: "鎖定測試 (已鎖定)",
    });

    await supertest(app)
      .get(`/api/boards/${isLocked.board_id}/sub-boards`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(0);
      });
  });
});
