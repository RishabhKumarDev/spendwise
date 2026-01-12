import mongoose from "mongoose";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import ReportModel from "../models/report.model";
import { NotFoundException } from "../utils/app-error";
import { createNextReportDate } from "../utils/helper";
import {
  ReportPaginationType,
  updateReportSettingType,
} from "../validators/report.validators";
import TransactionModel, {
  TransactionTypeEnum,
} from "../models/transaction.model";
import { convertFromCents } from "../utils/format-currency";
import { format } from "date-fns";
import { genAI, genAiModel } from "../config/google-ai.config";
import { createUserContent } from "@google/genai";
import { reportInsightPrompt } from "../utils/prompt";

export const getAllReportService = async (
  userId: string,
  pagination: ReportPaginationType
) => {
  const query = { userId };
  const { pageNumber, pageSize } = pagination;
  const skip = pageSize * (pageNumber - 1);

  const [reports, totalCount] = await Promise.all([
    ReportModel.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
    ReportModel.countDocuments(query),
  ]);

  const totalPage = Math.ceil(totalCount / pageSize);

  return {
    reports,
    pagination: {
      totalCount,
      totalPage,
      pageSize,
      skip,
      pageNumber,
    },
  };
};

export const updateReportSettingService = async (
  userId: string,
  body: updateReportSettingType
) => {
  const { isEnabled } = body;

  let nextReportDate: Date | null = null;

  const existingReportSetting = await ReportSettingModel.findOne({ userId });

  if (!existingReportSetting) {
    throw new NotFoundException("No Report setting found");
  }
  const frequency =
    existingReportSetting?.frequency || ReportFrequencyEnum.MONTHLY;

  if (isEnabled) {
    const currentNextReportDate = existingReportSetting?.nextReportDate;
    const now = new Date();
    if (!currentNextReportDate || currentNextReportDate <= now) {
      nextReportDate = createNextReportDate(
        existingReportSetting?.lastSentDate
      );
    } else {
      nextReportDate = currentNextReportDate;
    }
  }

  existingReportSetting?.set({
    ...body,
    nextReportDate,
  });

  await existingReportSetting.save();
};

export const generateReportService = async (
  userId: string,
  fromDate: Date,
  toDate: Date
) => {
  const match = {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: fromDate, $lte: toDate },
    },
  };
  const categoryGroup = {
    $group: {
      _id: "$category",
      total: {
        $sum: { $abs: "$amount" },
      },
    },
  };
  const moneyGroup = {
    $group: {
      _id: null,
      totalIncome: {
        $sum: {
          $cond: [
            { $eq: ["$type", TransactionTypeEnum.INCOME] },
            { $abs: "$amount" },
            0,
          ],
        },
      },
      totalExpense: {
        $sum: {
          $cond: [
            { $eq: ["$type", TransactionTypeEnum.EXPENSE] },
            { $abs: "$amount" },
            0,
          ],
        },
      },
    },
  };
  const facet = {
    $facet: {
      categories: [
        { $match: { type: TransactionTypeEnum.EXPENSE } },
        categoryGroup,
        { $sort: { total: -1 as const } },
        { $limit: 5 },
      ],
      summary: [moneyGroup],
    },
  };

  const project = {
    $project: {
      totalIncome: { $arrayElemAt: ["$summary.totalIncome", 0] },
      totalExpense: { $arrayElemAt: ["$summary.totalExpense", 0] },
      categories: 1,
    },
  };
  const results = await TransactionModel.aggregate([match, facet, project]);

  if (
    !results?.length ||
    (results[0]?.totalIncome === 0 && results[0]?.totalExpense === 0)
  ) {
    return null;
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    categories = [],
  } = results[0] || {};

  const byCategory = categories.reduce(
    (acc: any, { _id, total }: any) => {
      acc[_id] = {
        amount: convertFromCents(total),
        percentage:
          totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
      };
      return acc;
    },
    {} as Record<string, { amount: number; percentage: number }>
  );
  const availableBalance = totalIncome - totalExpense;
  const savingsRate = calculateSavingRate(totalIncome, totalExpense);

  const periodLabel = `${format(fromDate, "MMMM d")} - ${format(toDate, "d, yyyy")}`;
  const insights = await generateInsightsAI({
    totalIncome,
    totalExpense,
    availableBalance,
    savingsRate,
    categories: byCategory,
    periodLabel,
  });

  const topCategories = Object.entries(byCategory)?.map(([name, cat]: any) => ({
    name,
    amount: cat.amount,
    percent: cat.percentage,
  }));
  return {
    period: periodLabel,
    summary: {
      income: convertFromCents(totalIncome),
      expense: convertFromCents(totalExpense),
      balance: convertFromCents(availableBalance),
      savingsRate: Number(savingsRate.toFixed(1)),
      topCategories,
    },
    insights,
  };
};

async function generateInsightsAI({
  totalIncome,
  totalExpense,
  availableBalance,
  savingsRate,
  categories,
  periodLabel,
}: {
  totalIncome: number;
  totalExpense: number;
  availableBalance: number;
  savingsRate: number;
  categories: Record<string, { amount: number; percentage: number }>;
  periodLabel: string;
}) {
  try {
    const prompt = reportInsightPrompt({
      totalIncome: convertFromCents(totalIncome),
      totalExpenses: convertFromCents(totalExpense),
      availableBalance: convertFromCents(availableBalance),
      savingsRate: Number(savingsRate),
      categories,
      periodLabel,
    });
    const result = await genAI.models.generateContent({
      model: genAiModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "");
    if (!cleanedText) {
      return [];
    }
    const data = JSON.parse(cleanedText);
    return data;
  } catch (error) {
    return error;
  }
}

function calculateSavingRate(totalIncome: number, totalExpense: number) {
  if (totalIncome <= 0) return 0;

  const savingRate = ((totalIncome - totalExpense) / totalIncome) * 100;
  return parseFloat(savingRate.toFixed(2));
}
