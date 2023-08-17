import Post from "@/backend-api/database/entities/Post";
import BoardFactory from "@/backend-api/database/factories/BoardFactory";
import { faker } from "@faker-js/faker";
import {
  EagerInstanceAttribute,
  FactorizedAttrs,
  Factory,
  SingleSubfactory,
} from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";

export default class PostFactory extends Factory<Post> {
  protected entity = Post;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<Post> {
    return {
      board: new EagerInstanceAttribute(
        (_instance) => new SingleSubfactory(BoardFactory)
      ),
      title: faker.lorem.lines(1),
      content: faker.lorem.sentences(),
    };
  }
}
