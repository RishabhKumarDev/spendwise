import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import {
  generateReportService,
  getAllReportService,
  updateReportSettingService,
} from "../services/report.service";
import {
  reportPaginationSchema,
  updateReportSettingSchema,
} from "../validators/report.validators";

export const getAllReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const pagination = reportPaginationSchema.parse(req.query);
    const reports = await getAllReportService(userId, pagination);

    res.status(HTTP_STATUS.OK).json({
      message: "Report fetched successfully",
      data: { ...reports },
    });
  }
);

export const updateReportSetting = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = updateReportSettingSchema.parse(req.body);

    await updateReportSettingService(userId, body);

    res.status(HTTP_STATUS.OK).json({
      message: "Report setting updated Successfull",
    });
  }
);

export const generateReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { from, to } = req.query;
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    const result = await generateReportService(userId, fromDate, toDate);
    res.status(HTTP_STATUS.OK).json({
      message: "Transaction generated successfully",
      data: {
        ...result,
      },
    });
  }
);
