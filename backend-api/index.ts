import cors from "cors";
import express, { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import Draft from "../electron-src/database/entities/Draft";

const app = express();

app.use(cors());
app.use(express.json());

app.post(
  "/api/drafts",
  checkSchema(
    {
      subject: { trim: true, notEmpty: true },
      content: { notEmpty: true },
    },
    ["body"]
  ),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const draft = new Draft();

    ({ subject: draft.subject, content: draft.content } = req.body);

    await draft.save();

    res.status(201).json({ ...draft });
  }
);

export default app;
