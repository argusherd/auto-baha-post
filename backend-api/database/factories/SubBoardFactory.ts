import { faker } from "@faker-js/faker";
import {
  EagerInstanceAttribute,
  FactorizedAttrs,
  Factory,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";
import SubBoard from "../entities/SubBoard";
import BoardFactory from "./BoardFactory";

export default class SubBoardFactory extends Factory<SubBoard> {
  protected entity = SubBoard;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<SubBoard> {
    return {
      board: new EagerInstanceAttribute(
        (_instance) => new SingleSubfactory(BoardFactory)
      ),
      value: faker.number.int.toString(),
      text: faker.lorem.slug(),
    };
  }
}
