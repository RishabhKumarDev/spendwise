export interface FilterParams {
  preset?: string;
  from?: string;
  to?: string;
}

interface SavingRate {
  percentage: number;
  expenseRatio: number;
}
interface PercentageChange {
  income: number;
  expense: number;
  balance: number;
  prevPeriodFrom: string | null;
  prevPeriodTo: string | null;
  previousValues: {
    incomeAmount: number;
    expenseAmount: number;
    balanceAmount: number;
  };
}
interface PresetType {
  from: string;
  to: string;
  value: string;
  label: string;
}
export interface SummaryAnalyticsResponse {
  message: string;
  data: {
    totalIncome: number;
    totalExpense: number;
    availableBalance: number;
    transactionCount: number;
    savingRate: SavingRate;
    percentageChange: PercentageChange;
    preset: PresetType;
  };
}

export interface ChartAnalyticsResponse {
  message: string;
  data: {
    chartData: {
      date: string;
      totalIncome: number;
      totalExpense: number;
    }[];
    totalIncomeCount: number;
    totalExpenseCount: number;
    preset: PresetType;
  };
}

export interface ExpensePieChartBreakdownResponse {
  message: string;
  data: {
    totalSpent: number;
    breakdown: {
      name: string;
      value: number;
      percentage: number;
    }[];
    preset: PresetType;
  };
}
