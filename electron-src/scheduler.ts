import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";

const schduler = new ToadScheduler();

const logTask = new Task("log", () => console.log("this is from scheduler"));
const logJob = new SimpleIntervalJob({ seconds: 1 }, logTask);

schduler.addSimpleIntervalJob(logJob);

export default schduler;
