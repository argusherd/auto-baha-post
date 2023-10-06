import Login from "@/backend-api/database/entities/Login";
import { faker } from "@faker-js/faker";
import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";

export default class LoginFactory extends Factory<Login> {
  protected entity = Login;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<Login> {
    return {
      name: faker.internet.displayName(),
      account: faker.internet.userName,
      logged_in: true,
    };
  }
}
