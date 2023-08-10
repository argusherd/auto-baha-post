import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";

export class HasId extends BaseEntity {
  id: number;
}

const bindEntity =
  (entity: typeof HasId) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = entity.name.toLowerCase();

    if (!req.params[key]) return res.sendStatus(404);

    const id = Number(req.params[key]);

    const target = await entity.findOneBy({ id });

    if (!target) return res.sendStatus(404);

    req[key] = target;

    next();
  };

export default bindEntity;
