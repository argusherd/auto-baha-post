import app from "@/backend-api";
import Board from "@/backend-api/database/entities/Board";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import request from "supertest";

describe("create a board api", () => {
  it("can persist board data in database", async () => {
    await request(app)
      .post("/api/boards")
      .send({ no: "123456", name: "foobar" })
      .expect(201);

    const board = await Board.findOneBy({ no: "123456", name: "foobar" });

    expect(board).not.toBeNull();
  });

  it("is not allowed empty no or empty name", async () => {
    await request(app)
      .post("/api/boards")
      .send({ no: " ", name: "foobar" })
      .expect(422)
      .expect((res) => expect(res.body.errors[0].path).toEqual("no"));

    await request(app)
      .post("/api/boards")
      .send({ no: "123456", name: " " })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "name" }] }),
      );
  });

  it("only accept unique no and unique name", async () => {
    const existBoard = await new BoardFactory().create();

    await request(app)
      .post("/api/boards")
      .send({ no: existBoard.no, name: "new board" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] }),
      );

    await request(app)
      .post("/api/boards")
      .send({ no: "123456", name: existBoard.name })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "name" }] }),
      );
  });

  it("only allow digits and integer in board no", async () => {
    await request(app)
      .post("/api/boards")
      .send({ no: "not_digits", name: "new board" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] }),
      );

    await request(app)
      .post("/api/boards")
      .send({ no: "123.456", name: "new board" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] }),
      );
  });

  it("only allow positive board no", async () => {
    await request(app)
      .post("/api/boards")
      .send({ no: "-123456", name: "new board" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] }),
      );
  });
});
