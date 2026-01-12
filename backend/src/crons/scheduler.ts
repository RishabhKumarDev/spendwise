import cron from "node-cron";
import { processingRecurringTransaction } from "./jobs/transaction.jobs";
import { processReportJob } from "./jobs/report.job";

const scheduleJob = (name: string, time: string, job: Function) => {
  console.log(`Scheduling ${name} at ${time}`);

  return cron.schedule(
    time,
    async () => {
      try {
        await job();
        console.log(`${name} completed`);
      } catch (error) {
        console.log(`Failed ${name}`, error);
      }
    },
    { scheduled: true, timezone: "UTC" }
  );
};

export const startJobs = () => {
  return [
    scheduleJob("Transaction", "5 0 * * *", processingRecurringTransaction),
    scheduleJob("Report", "30 2 1 * *", processReportJob)
  ];
};
 