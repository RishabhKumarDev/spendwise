import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { MulterError } from "multer";

const handleMulterError = (error: MulterError) => {
  const messages = {
    LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file' ",
    LIMIT_FILE_SIZE: "File size exceeds the limit",
    LIMIT_FILE_COUNT: "Too many files uploaded",
    default: "File upload error",
  };

  return {
    status: HTTP_STATUS.BAD_REQUEST,
    message: messages[error.code as keyof typeof messages] || messages.default,
    err: error.message,
  };
};

const formatError = (res: Response, err: ZodError) => {
  const errors = err?.issues?.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: "Validation Failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error occurred:", {
    path: req.path,
    name: err?.name,
    message: err?.message,
    err: err?.issues,
    stact: err?.stack,
  });

  if (err instanceof ZodError) {
    formatError(res, err);
    return;
  }

  if (err instanceof MulterError) {
    const { status, message, err: error } = handleMulterError(err);

    res
      .status(status)
      .json({ message, error, errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: err?.message || "Unexpected Error Occured",
  });
};
