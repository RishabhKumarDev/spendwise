import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const authRouter = Router({ mergeParams: true });

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);

export default authRouter;
