import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
import { t } from "i18next";
import moment from "moment";
import { Like, MoreThanOrEqual, Not } from "typeorm";
import Board from "../database/entities/Board";
import Demonstratio from "../database/entities/Demonstratio";
import Post from "../database/entities/Post";
import SubBoard from "../database/entities/SubBoard";
import bindEntity from "../middlewares/route-entity-binding";
import validator from "../middlewares/validate-request";

const router = Router();

const validateBoard = [
  body("no")
    .isInt({ min: 0 })
    .withMessage(() =>
      t("error.not_positive_int", { column: t("input.board_no") }),
    ),
  body("name")
    .trim()
    .notEmpty()
    .withMessage(() => t("error.not_empty", { column: t("input.board_name") })),
];

router.get("/boards", async (_req: Request, res: Response) => {
  res.json(await Board.find());
});

router.post(
  "/boards",
  validator([
    ...validateBoard,
    body("no")
      .custom(notInUse("no"))
      .withMessage(() =>
        t("error.not_in_use", { column: t("input.board_no") }),
      ),
    body("name")
      .custom(notInUse("name"))
      .withMessage(() =>
        t("error.not_in_use", { column: t("input.board_name") }),
      ),
  ]),
  async (req: Request, res: Response) => {
    const board = new Board();

    ({ no: board.no, name: board.name } = req.body);

    res.status(201).json(await board.save());
  },
);

router.put(
  "/boards/:board",
  bindEntity(Board),
  validator(validateBoard),
  (req: Request, res: Response, next: NextFunction) => {
    validator([
      body("no")
        .custom(notInUse("no", req.board.id))
        .withMessage(() =>
          t("error.not_in_use", { column: t("input.board_no") }),
        ),
      body("name")
        .custom(notInUse("name", req.board.id))
        .withMessage(() =>
          t("error.not_in_use", { column: t("input.board_name") }),
        ),
    ])(req, res, next);
  },
  async (req: Request, res: Response) => {
    const board = req.board;

    ({ no: board.no, name: board.name } = req.body);

    res.json(await board.save());
  },
);

router.delete(
  "/boards/:board",
  bindEntity(Board),
  async (req: Request, res: Response) => {
    const notDeletable = await Post.countBy({
      board_id: req.board.id,
      scheduled_at: MoreThanOrEqual(
        moment().utc().format("YYYY-MM-DD HH:mm:ss"),
      ),
    });

    if (notDeletable) return res.sendStatus(409);

    await req.board.remove();

    res.sendStatus(200);
  },
);

router.get(
  "/boards/:board/demonstratios",
  bindEntity(Board),
  async (req: Request, res: Response) => {
    const { id: board_id } = req.board;

    res.json(await Demonstratio.findBy({ board_id, value: Not("0") }));
  },
);

router.get(
  "/boards/:board/sub-boards",
  bindEntity(Board),
  async (req: Request, res: Response) => {
    const { id: board_id } = req.board;

    res.json(
      await SubBoard.findBy({
        board_id,
        value: Not("0"),
        text: Not(Like("%已鎖定%")),
      }),
    );
  },
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
