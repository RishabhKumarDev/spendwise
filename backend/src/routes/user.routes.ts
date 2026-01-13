import { Router } from "express";
import { getCurrentUser, updateUser } from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";
import { upload } from "../config/cloudinary.config";

const userRouter = Router();

userRouter.use(passportAuthenticateJwt);

userRouter.route("/current-user").get(getCurrentUser);

userRouter.route("/update").patch(upload.single("profilePicture"), updateUser);

export default userRouter;
