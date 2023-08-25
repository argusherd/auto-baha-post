import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { Not } from "typeorm";
import Board from "../database/entities/Board";
import Post from "../database/entities/Post";
import bindEntity from "../middlewares/route-entity-binding";
import validator from "../middlewares/validate-request";

const router = Router();

const validateBoard = [
  body("no").trim().notEmpty().isNumeric(),
  body("name").trim().notEmpty(),
];

router.get("/boards", async (_req: Request, res: Response) => {
  res.json(await Board.find());
});

router.post(
  "/boards",
  validator([
    ...validateBoard,
    body("no").custom(notInUse("no")),
    body("name").custom(notInUse("name")),
  ]),
  async (req: Request, res: Response) => {
    const board = new Board();

    ({ no: board.no, name: board.name } = req.body);

    res.status(201).json(await board.save());
  }
);

router.put(
  "/boards/:board",
  bindEntity(Board),
  validator(validateBoard),
  (req: Request, res: Response, next: NextFunction) => {
    validator([
      body("no").custom(notInUse("no", req.board.id)),
      body("name").custom(notInUse("name", req.board.id)),
    ])(req, res, next);
  },
  async (req: Request, res: Response) => {
    const board = req.board;

    ({ no: board.no, name: board.name } = req.body);

    res.json(await board.save());
  }
);

router.delete(
  "/boards/:board",
  bindEntity(Board),
  async (req: Request, res: Response) => {
    const notDeletable = await Post.countBy({ board_id: req.board.id });

    if (notDeletable) return res.sendStatus(409);

    await req.board.remove();

    res.sendStatus(200);
  }
);

function notInUse(column: string, ignoreId?: number) {
  return async function (value: any) {
    const isUsed = await Board.countBy({
      [column]: value,
      ...(ignoreId && { id: Not(ignoreId) }),
    });

    return isUsed ? Promise.reject() : Promise.resolve();
  };
}

export default router;
