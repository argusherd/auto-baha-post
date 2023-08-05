import Board from "@/backend-api/database/entities/Board";
import { faker } from "@faker-js/faker";
import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";

export default class BoardFactory extends Factory<Board> {
  protected entity = Board;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<Board> {
    return {
      no: String(faker.number.int()),
      name: faker.internet.displayName(),
    };
  }
}
