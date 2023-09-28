import { AsyncTask } from "toad-scheduler";
import PostPublisher from "../components/PostPublisher";

const publishAPost = new AsyncTask("publish a post", async () => {
  const postPublisher = new PostPublisher();

  await postPublisher.run();
});

export default publishAPost;
