import { Request, Response, Router } from "express";
import Login from "../database/entities/Login";

const router = Router();

router.get("/login/check", async (_req: Request, res: Response) => {
  const record = await Login.findOne({
    order: { created_at: "DESC" },
    where: { id: null },
  });

  const fallback: Partial<Login> = {
    name: null,
    account: null,
    logged_in: false,
    created_at: null,
  };

  res.json(record || fallback);
});

export default router;
