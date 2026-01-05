import mongoose from "mongoose";
import { HTTP_STATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import UserModel from "../models/user.model";
import { AppError, NotFoundException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validators";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { createNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";

export const registerUserService = async (body: RegisterSchemaType) => {
  const { name, email, password } = body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }, null, { session });

    if (existingUser) {
      throw new AppError(
        "Email already in use",
        HTTP_STATUS.CONFLICT,
        ErrorCodeEnum.USER_ALREADY_EXISTS
      );
    }

    const newUser = new UserModel({ name, email, password });
    await newUser.save({ session });

    const reportSetting = new ReportSettingModel({
      userId: newUser._id,
      frequency: ReportFrequencyEnum.MONTHLY,
      isEnabled: true,
      lastSentDate: null,
      nextReportDate: createNextReportDate(),
    });
    await reportSetting.save({ session });
    await session.commitTransaction();

    return { user: newUser.omitPassword() };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const loginUserService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  const existingUser = await UserModel.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new AppError(
      "Invalid email or password",
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodeEnum.INVALID_CREDENTIALS
    );
  }

  const isPasswordCorrect = await existingUser.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError(
      "Invalid email or password",
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodeEnum.INVALID_CREDENTIALS
    );
  }

  const { token, expiresAt } = signJwtToken({
    userId: String(existingUser._id),
  });

  const reportSetting = await ReportSettingModel.findOne(
    {
      userId: existingUser.id,
    },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    accessToken: token,
    expiresAt,
    user: existingUser.omitPassword(),
    reportSetting,
  };
};
