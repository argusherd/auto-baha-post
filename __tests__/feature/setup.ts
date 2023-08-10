import { resolveDB } from "@/backend-api/database/connection";
import { DataSource } from "typeorm";

let DB: DataSource;

beforeEach(async () => {
  DB = resolveDB();
  await DB.initialize();
  await DB.runMigrations();
});

afterEach(async () => {
  await DB.destroy();
  jest.clearAllMocks();
});
