import mongoose from "mongoose";
import { DateRangePreset } from "../enums/date-range.enum";
import TransactionModel, {
  TransactionTypeEnum,
} from "../models/transaction.model";
import { getDateRange } from "../utils/date";

export const summaryAnalyticsService = async (
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);

  const { from, to, value, label } = range;

  const match = {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      ...(from && to && { date: { $gte: from, $lte: to } }),
    },
  };

  const group = {
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
      transactionCount: {
        $sum: 1,
      },
    },
  };

  const project = {
    $project: {
      _id: 0,
      totalIncome: 1,
      totalExpense: 1,
      transactionCount: 1,
      availableBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
      savingData: {
        $let: {
          vars: {
            income: { $ifNull: ["$totalIncome", 0] },
            expense: { $ifNull: ["$totalExpense", 0] },
          },
          in: {
            // ((income-expense)/income )*100
            savingsPercentage: {
              $cond: [
                { $lte: ["$$income", 0] },
                0,
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ["$$income", "$$expense"] },
                        "$$income",
                      ],
                    },
                    100,
                  ],
                },
              ],
            },
            // (expense/income)*100
            expenseRatio: {
              $cond: [
                { $lte: ["$$income", 0] },
                0,
                {
                  $multiply: [
                    {
                      $divide: ["$$expense", "$$income"],
                    },
                    100,
                  ],
                },
              ],
            },
          },
        },
      },
    },
  };

  const [current] = await TransactionModel.aggregate([match, group, project]);

  const {
    totalIncome = 0,
    totalExpense = 0,
    transactionCount = 0,
    availableBalance = 0,
    savingData = {
      expenseRatio: 0,
      savingsPercentage: 0,
    },
  } = current || {};

  console.log(current,"Current 💲💲💲")
};
