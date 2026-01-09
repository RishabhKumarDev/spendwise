import "dotenv/config";
import connectDatabase from "./config/database.config";
import { initlizeCrons } from "./crons";

const init = async () => {
  await connectDatabase();
  await initlizeCrons();
};

init();
