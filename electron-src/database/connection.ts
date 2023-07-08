import { DataSource } from "typeorm";

let DB: DataSource;

const createConnection = () => {
  return DB
    ? DB
    : (DB = new DataSource({
        type: "sqlite",
        database: process.env.DATABASE_URL as string,
      }));
};

export default createConnection;
