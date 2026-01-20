import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  findByIdUserSevrice,
  updateUserService,
} from "../services/user.service";
import { HTTP_STATUS } from "../config/http.config";
import { updateUserSchema } from "../validators/user.validators";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await findByIdUserSevrice(userId);

    res.status(HTTP_STATUS.OK).json({
      message: "User fetched successfully",
      data: { ...user },
    });
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const body = updateUserSchema.parse(req.body);
  const userId = req.user?._id;
  const profilePic = req?.file;

  const user = await updateUserService(userId, body, profilePic);
  res
    .status(HTTP_STATUS.OK)
    .json({ message: "Successfully update user profile", data: { ...user } });
});
