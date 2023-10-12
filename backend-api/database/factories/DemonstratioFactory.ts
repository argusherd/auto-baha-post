import { faker } from "@faker-js/faker";
import {
  EagerInstanceAttribute,
  FactorizedAttrs,
  Factory,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";
import Demonstratio from "../entities/Demonstratio";
import BoardFactory from "./BoardFactory";

export default class DemonstratioFactory extends Factory<Demonstratio> {
  protected entity = Demonstratio;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<Demonstratio> {
    return {
      board: new EagerInstanceAttribute(
        (_instance) => new SingleSubfactory(BoardFactory)
      ),
      value: faker.number.int.toString(),
      text: faker.lorem.slug(),
    };
  }
}
