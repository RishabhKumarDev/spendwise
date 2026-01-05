import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const userRouter = Router();

userRouter.use(passportAuthenticateJwt);

userRouter.route("/current-user").get(getCurrentUser);

export default userRouter;
