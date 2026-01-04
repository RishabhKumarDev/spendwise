import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("Error Occured on Path:", req.path);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
    return;
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err?.message || "Unexpected Error Occured",
  });
};
