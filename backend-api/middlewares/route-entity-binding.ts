import { NextFunction, Request, Response } from "express";
import { BaseEntity } from "typeorm";

declare module "express" {
  interface Request {
    [key: string]: any;
  }
}
export class HasId extends BaseEntity {
  id: number;
}

const bindEntity =
  (entity: typeof HasId) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = entity.name.toLowerCase();
    const id = Number(req.params[key]);

    if (!req.params[key] || !id) return res.sendStatus(404);

    const target = await entity.findOneBy({ id });

    if (!target) return res.sendStatus(404);

    req[key] = target;

    next();
  };

export default bindEntity;
