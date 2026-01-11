import { Router } from "express";
import {
  getAllReport,
  updateReportSetting,
} from "../controllers/report.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const reportRouter = Router({ mergeParams: true });

reportRouter.use(passportAuthenticateJwt)

reportRouter.route("/update-setting").patch(updateReportSetting);
reportRouter.route("/all").get(getAllReport);

export default reportRouter;
