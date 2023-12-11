import { readdirSync } from "fs";
import { join } from "path";
import { DataSource } from "typeorm";

let DB: DataSource;

export function resolveDB() {
  if (DB) return DB;

  const entities = readdirSync(join(__dirname, "schemas")).map((file) =>
    join(__dirname, "schemas", file),
  );

  const migrations = readdirSync(join(__dirname, "migrations")).map((file) =>
    join(__dirname, "migrations", file),
  );

  const subscribers = readdirSync(join(__dirname, "subscribers")).map((file) =>
    join(__dirname, "subscribers", file),
  );

  DB = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_URL as string,
    dropSchema: process.env.NODE_ENV != "production",
    entities,
    migrations,
    migrationsRun: true,
    subscribers,
  });

  return DB;
}

export const revokeDB = async () => await DB.destroy();
