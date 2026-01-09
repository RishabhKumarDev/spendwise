import { startJobs } from "./scheduler";

export const initlizeCrons = async () => {
  try {
    const jobs = startJobs();
    console.log(`Initilized ${jobs.length} cron jobs`);
    return jobs;
  } catch (error) {
    console.log(`CRON INIT ERROR: ${error}`);
    return [];
  }
};
