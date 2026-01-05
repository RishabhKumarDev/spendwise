import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { findByIdUserSevrice } from "../services/user.service";
import { HTTP_STATUS } from "../config/http.config";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await findByIdUserSevrice(userId);

    res.status(HTTP_STATUS.OK).json({
      message: "User fetched successfully",
      data: { user },
    });
  }
);
