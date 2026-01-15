import { Router } from "express";
import { chartAnalytics, expensePieChartBreakdown, summaryAnalytics } from "../controllers/analytics.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const analyticsRouter = Router({ mergeParams: true });


analyticsRouter.use(passportAuthenticateJwt);

analyticsRouter.route("/summary").get(summaryAnalytics);
analyticsRouter.route("/chart").get(chartAnalytics);
analyticsRouter.route("/expense-breakdown").get(expensePieChartBreakdown);


export default analyticsRouter;