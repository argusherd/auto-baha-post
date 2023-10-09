import { SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import checkLogin from "./tasks/check-login";
import publishAPost from "./tasks/publish-a-post";

const schduler = new ToadScheduler();

const publishJob = new SimpleIntervalJob({ minutes: 1 }, publishAPost);
const checkLoginJob = new SimpleIntervalJob(
  { hours: 1, runImmediately: true },
  checkLogin
);

schduler.addSimpleIntervalJob(publishJob);
schduler.addSimpleIntervalJob(checkLoginJob);

export default schduler;
