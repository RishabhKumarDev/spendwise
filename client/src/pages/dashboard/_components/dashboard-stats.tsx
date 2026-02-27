import { DateRangeType } from "@/components/date-range-select";
import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsApi";
import SummaryCard from "@/pages/dashboard/_components/summary-card";

function DashboardStats({ dateRange }: { dateRange?: DateRangeType }) {
  const { data, isFetching } = useSummaryAnalyticsQuery(
    { preset: dateRange?.value },
    { skip: !dateRange },
  );

  const summaryData = data?.data;

  return (
    <div className="flex flex-row items-center">
      <div className="flex-1 lg:flex-[1] grid grid-cols-1 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Available Balance"
          value={summaryData?.availableBalance ?? 15230.75}
          dateRange={dateRange}
          percentageChange={summaryData?.percentageChange?.balance ?? 0}
          isLoading={isFetching}
          cardType="balance"
        />
        <SummaryCard
          title="Total Income"
          value={summaryData?.totalIncome ?? 25300.5}
          percentageChange={summaryData?.percentageChange?.income ?? 12.8}
          dateRange={dateRange}
          isLoading={isFetching}
          cardType="income"
        />
        <SummaryCard
          title="Total Expenses"
          value={summaryData?.totalExpense ?? 10069.75}
          dateRange={dateRange}
          percentageChange={summaryData?.percentageChange?.expense ?? 3.5}
          isLoading={isFetching}
          cardType="expenses"
        />
        <SummaryCard
          title="Savings Rate"
          value={summaryData?.savingRate?.percentage ?? 19}
          expenseRatio={summaryData?.savingRate?.expenseRatio ?? 34}
          isPercentageValue
          dateRange={dateRange}
          isLoading={isFetching}
          cardType="savings"
        />
      </div>
    </div>
  );
}

export default DashboardStats;
