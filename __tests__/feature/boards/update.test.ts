import app from "@/backend-api";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import request from "supertest";

describe("update a board api", () => {
  it("can update an existing board", async () => {
    const board = await new BoardFactory().create({
      no: "123456",
      name: "foobar",
    });

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: "777777", name: "new board" });

    await board.reload();

    expect(board).toMatchObject({ no: "777777", name: "new board" });
  });

  it("cannot update a board that does not exist in the db", async () => {
    const notExists = 777777;

    await request(app)
      .put(`/api/boards/${notExists}`)
      .send({ no: "123456", name: "foobar" })
      .expect(404);
  });

  it("can only allow digits in board no", async () => {
    const board = await new BoardFactory().create();

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: "not_digits", name: "foobar" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] })
      );
  });

  it("does not accept empty no or empty name", async () => {
    const board = await new BoardFactory().create();

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: " ", name: "foobar" })
      .expect(422)
      .expect((res) => expect(res.body.errors[0].path).toEqual("no"));

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: "123456", name: " " })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "name" }] })
      );
  });

  it("only accept unique no and unique name", async () => {
    const board = await new BoardFactory().create();
    const overlap = await new BoardFactory().create();

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: overlap.no, name: "new board" })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "no" }] })
      );

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: "123456", name: overlap.name })
      .expect(422)
      .expect((res) =>
        expect(res.body).toMatchObject({ errors: [{ path: "name" }] })
      );
  });

  it("ignores the current board when checking for unique no and unique name", async () => {
    const board = await new BoardFactory().create();

    await request(app)
      .put(`/api/boards/${board.id}`)
      .send({ no: board.no, name: board.name })
      .expect(200);
  });
});
