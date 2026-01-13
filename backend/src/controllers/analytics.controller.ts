import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { DateRangePreset } from "../enums/date-range.enum";
import { HTTP_STATUS } from "../config/http.config";
import { summaryAnalyticsService } from "../services/analytics.service";

export const summaryAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { preset, from, to } = req.query;
    const filters = {
      dateRangePreset: preset as DateRangePreset,
      customFrom: from ? new Date(from as string) : undefined,
      customTo: to ? new Date(to as string) : undefined,
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
        stats,
      },
    });
  }
);
