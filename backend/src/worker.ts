import "dotenv/config";
import connectDatabase from "./config/database.config";
import { initlizeCrons } from "./crons";

// model imports
import "./models/user.model";
import "./models/report-setting.model";
import "./models/report.model";
import "./models/transaction.model";

const init = async () => {
  await connectDatabase();
  await initlizeCrons();
};

init();
