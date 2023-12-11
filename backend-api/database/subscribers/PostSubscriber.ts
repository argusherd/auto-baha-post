import moment from "moment";
import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from "typeorm";
import Post from "../entities/Post";

@EventSubscriber()
export default class PostSubscriber implements EntitySubscriberInterface {
  listenTo(): string | Function {
    return Post;
  }

  afterLoad(_entity: any, event?: LoadEvent<Post>): void | Promise<any> {
    const { entity: post } = event;

    let type = "draft";

    if (moment().isBefore(post.scheduled_at)) type = "upcoming";
    else if (post.publish_failed) type = "failed";
    else if (post.published_at) type = "published";
    else if (moment().isAfter(post.scheduled_at)) type = "outdated";

    post.type = type;
  }
}
