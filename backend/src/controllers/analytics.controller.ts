import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { DateRangePreset } from "../enums/date-range.enum";
import { HTTP_STATUS } from "../config/http.config";
import {
  chartAnalyticsService,
  expensePieChartBreakdownService,
  summaryAnalyticsService,
} from "../services/analytics.service";
import { summaryAnalyticsQuerySchema } from "../validators/analytics.validators";

export const summaryAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { preset, from, to } = summaryAnalyticsQuerySchema.parse(req.query);
    const filters = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from,
      customTo: to,
    };

    const stats = await summaryAnalyticsService(
      userId,
      filters.dateRangePreset,
      filters.customFrom,
      filters.customTo
    );

    res.status(HTTP_STATUS.OK).json({
      message: "Summary fetched successfully",
      data: {
        ...stats,
      },
    });
  }
);

export const chartAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = summaryAnalyticsQuerySchema.parse(req.query);
    const { preset, from, to } = body;

    const chartData = await chartAnalyticsService(userId, preset, from, to);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Chart fetched successfully", data: { ...chartData } });
  }
);

export const expensePieChartBreakdown = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = summaryAnalyticsQuerySchema.parse(req.query);
    const { preset, from, to } = body;

    const pieChartData = await expensePieChartBreakdownService(
      userId,
      preset,
      from,
      to
    );

    res.status(HTTP_STATUS.OK).json({
      message: "PieChart data fetched successfully",
      data:{
        ...pieChartData
      }
    });
  }
);
