import { Router } from "express";
import { summaryAnalytics } from "../controllers/analytics.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const analyticsRouter = Router({ mergeParams: true });


analyticsRouter.use(passportAuthenticateJwt);

analyticsRouter.route("/summary").get(summaryAnalytics);

export default analyticsRouter;