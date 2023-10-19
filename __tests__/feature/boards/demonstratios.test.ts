import app from "@/backend-api";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import DemonstratioFactory from "@/backend-api/database/factories/DemonstratioFactory";
import supertest from "supertest";

describe("the available demonstratios for posts api", () => {
  it("needs a board in order to get the demonstratios", async () => {
    const board = await new BoardFactory().create();

    await supertest(app)
      .get("/api/boards/NOT_EXISTS/demonstratios")
      .expect(404);

    await supertest(app)
      .get(`/api/boards/${board.id}/demonstratios`)
      .expect(200);
  });

  it("can get the demonstratios that available for posts", async () => {
    const demonstratio = await new DemonstratioFactory().create();

    await supertest(app)
      .get(`/api/boards/${demonstratio.board_id}/demonstratios`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].value).toEqual(demonstratio.value);
        expect(res.body[0].text).toEqual(demonstratio.text);
      });
  });

  it("excludes the demonstratio that value equals to 0", async () => {
    const equals0 = await new DemonstratioFactory().create({
      value: "0",
    });

    await supertest(app)
      .get(`/api/boards/${equals0.board_id}/demonstratios`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(0);
      });
  });
});
