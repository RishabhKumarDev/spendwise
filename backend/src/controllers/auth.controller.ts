import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { registerSchema } from "../validators/auth.validators";
import { registerUserService } from "../services/auth.service";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerUserService(body);

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User Created Successfully", data: result });
  }
);
