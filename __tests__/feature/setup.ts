import { resolveDB } from "@/backend-api/database/connection";
import * as matchers from "jest-extended";
import { DataSource } from "typeorm";

let DB: DataSource;

expect.extend(matchers);

beforeEach(async () => {
  DB = resolveDB();
  await DB.initialize();
  await DB.runMigrations();
});

afterEach(async () => {
  await DB.destroy();
  jest.resetAllMocks();
});
