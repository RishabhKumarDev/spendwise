import { Router } from "express";
import {
  generateReport,
  getAllReport,
  updateReportSetting,
} from "../controllers/report.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const reportRouter = Router({ mergeParams: true });

reportRouter.use(passportAuthenticateJwt)

reportRouter.route("/update-setting").patch(updateReportSetting);
reportRouter.route("/all").get(getAllReport);

reportRouter.route("/generate").get(generateReport);


export default reportRouter;
