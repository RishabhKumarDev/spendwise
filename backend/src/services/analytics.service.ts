import mongoose from "mongoose";
import { DateRangeEnum, DateRangePreset } from "../enums/date-range.enum";
import TransactionModel, {
  TransactionTypeEnum,
} from "../models/transaction.model";
import { getDateRange } from "../utils/date";
import { convertFromCents } from "../utils/format-currency";
import { differenceInDays, subDays, subYears } from "date-fns";

export const summaryAnalyticsService = async (
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);

  const { from, to, value: rangeValue, label } = range;

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
  console.log(current, "Current 💲💲💲");

  let percentageChange = {
    income: 0,
    expense: 0,
    balance: 0,
    prevPeriodFrom: null as Date | null,
    prevPeriodTo: null as Date | null,
    previousValues: {
      incomeAmount: 0,
      expenseAmount: 0,
      balanceAmount: 0,
    },
  };

  if (from && to && rangeValue !== DateRangeEnum.ALL_TIME) {
    const period = differenceInDays(to, from) + 1;

    console.log(`${differenceInDays(to, from)} Period (to - from)`);
    const isYearly = [
      DateRangeEnum.LAST_YEAR,
      DateRangeEnum.THIS_YEAR,
    ].includes(rangeValue);

    const prevPeriodFrom = isYearly ? subYears(from, 1) : subDays(from, period);
    const prevPeriodTo = isYearly ? subYears(to, 1) : subDays(to, period);

    const match = {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: prevPeriodFrom, $lte: prevPeriodTo },
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
      },
    };

    const [previous] = await TransactionModel.aggregate([match, group]);

    if (previous) {
      const previousIncome = previous.totalIncome || 0;
      const previousExpense = previous.totalExpense || 0;
      const previousBalance = previousIncome - previousExpense;

      const currentIncome = totalIncome;
      const currentExpense = totalExpense;
      const currentBalance = availableBalance;

      percentageChange = {
        income: calculatePercentageChange(previousIncome, currentIncome),
        expense: calculatePercentageChange(previousExpense, currentExpense),
        balance: calculatePercentageChange(previousBalance, currentBalance),
        prevPeriodFrom: prevPeriodFrom,
        prevPeriodTo: prevPeriodTo,
        previousValues: {
          incomeAmount: previousIncome,
          expenseAmount: previousExpense,
          balanceAmount: previousBalance,
        },
      };
    }
  }

  return {
    totalIncome: convertFromCents(totalIncome),
    totalExpense: convertFromCents(totalExpense),
    availableBalance: convertFromCents(availableBalance),
    transactionCount,
    savingRate: {
      percentage: parseFloat(savingData.savingsPercentage.toFixed(2)),
      expenseRatio: parseFloat(savingData.expenseRatio.toFixed(2)),
    },
    percentageChange: {
      ...percentageChange,
      previousValues: {
        incomeAmount: convertFromCents(
          percentageChange.previousValues.incomeAmount
        ),
        expenseAmount: convertFromCents(
          percentageChange.previousValues.expenseAmount
        ),
        balanceAmount: convertFromCents(
          percentageChange.previousValues.balanceAmount
        ),
      },
    },
    preset: {
      ...range,
      value: rangeValue || DateRangeEnum.ALL_TIME,
      label: range?.label || "All Time",
    },
  };
};

const calculatePercentageChange = (
  previous: number,
  current: number
): number => {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }

  const changes = ((current - previous) / Math.abs(previous)) * 100;
  return parseFloat(changes.toFixed(2));
};
