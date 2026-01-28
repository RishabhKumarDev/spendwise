import { DateRangeType } from "@/components/date-range-select";
import PageLayout from "@/components/page-layout";
import DashboardDataChart from "@/pages/dashboard/dashboard-data-chart";
import DashboardRecentTransactions from "@/pages/dashboard/dashboard-recent-transactions";
import DashboardSummary from "@/pages/dashboard/dashboard-summary";
import ExpensePieChart from "@/pages/dashboard/expense-pie-chart";
import { useState } from "react";

export default function Dashboard() {
  const [dateRange, _setDateRange] = useState<DateRangeType>(null);
  return (
    <div className="w-full flex flex-col">
      <PageLayout
        className="space-y-6"
        renderPageHeader={
          <DashboardSummary
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
      >
         {/* Dashboard Main Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <DashboardDataChart dateRange={dateRange}/>
          </div>
          <div className="lg:col-span-2">
            <ExpensePieChart dateRange={dateRange} />
          </div>
        </div>
        {/* Dashboard Recent Transactions */}
        <div className="w-full mt-0">
          <DashboardRecentTransactions />
          </div>
      </PageLayout>
    </div>
  );
}
