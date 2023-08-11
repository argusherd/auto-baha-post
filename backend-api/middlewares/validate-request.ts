import { NextFunction, Request, Response } from "express";
import {
  ValidationChain,
  ValidationChainLike,
} from "express-validator/src/chain";
import { RunnableValidationChains } from "express-validator/src/middlewares/schema";

const validator =
  (
    validations:
      | RunnableValidationChains<ValidationChainLike>
      | ValidationChain[]
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const errors = await validation.run(req);

      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    }

    next();
  };

export default validator;
