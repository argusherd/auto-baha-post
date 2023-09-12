import { SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import publishAPost from "./tasks/publish-a-post";

const schduler = new ToadScheduler();

const publishJob = new SimpleIntervalJob({ minutes: 1 }, publishAPost);

schduler.addSimpleIntervalJob(publishJob);

export default schduler;
