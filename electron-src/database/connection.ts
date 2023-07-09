import { DataSource } from "typeorm";

let DB: DataSource;

export function resolveDB() {
  if (DB) return DB;

  DB = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_URL as string,
    migrationsRun: true,
  });

  return DB;
}

export const revokeDB = async () => await DB.destroy();
