import { readdirSync } from "fs";
import { join } from "path";
import { DataSource } from "typeorm";

let DB: DataSource;

export function resolveDB() {
  if (DB) return DB;

  const entities = readdirSync(join(__dirname, "entities")).map((file) =>
    join(__dirname, "entities", file)
  );

  const migrations = readdirSync(join(__dirname, "migrations")).map((file) =>
    join(__dirname, "migrations", file)
  );

  DB = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_URL as string,
    dropSchema: process.env.NODE_ENV != "production",
    entities,
    migrations,
    migrationsRun: true,
  });

  return DB;
}

export const revokeDB = async () => await DB.destroy();
