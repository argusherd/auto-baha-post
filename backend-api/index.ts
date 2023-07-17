import Draft from "@/electron-src/database/entities/Draft";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/drafts", async (req, res) => {
  const draft = new Draft();

  ({ subject: draft.subject, content: draft.content } = req.body);

  await draft.save();

  res.status(201).json({ ...draft });
});

export default app;
