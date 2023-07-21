import Post from "@/backend-api/database/entities/Post";
import { faker } from "@faker-js/faker";
import { FactorizedAttrs, Factory } from "@jorgebodega/typeorm-factory";
import { resolveDB } from "../connection";

export default class PostFactory extends Factory<Post> {
  protected entity = Post;
  protected dataSource = resolveDB();
  protected attrs(): FactorizedAttrs<Post> {
    return {
      title: faker.lorem.lines(),
      content: faker.lorem.sentences(),
    };
  }
}
