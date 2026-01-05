import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerUserService(body);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User Created Successfully", data: result });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);

  const { user, expiresAt, accessToken, reportSetting } =
    await loginUserService(body);

  res
    .status(HTTP_STATUS.OK)
    .json({
      message: "User logged in successfully",
      data: { user, expiresAt, accessToken, reportSetting },
    });
});
