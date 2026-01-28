import { useTypedSelector } from "@/app/hook";
import { DateRangeType } from "@/components/date-range-select";
import DashboardHeader from "@/pages/dashboard/_components/dashboard-header";
import DashboardStats from "@/pages/dashboard/_components/dashboard-stats";

interface DashboardSummaryProps {
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}
function DashboardSummary({dateRange, setDateRange}:DashboardSummaryProps) {
  const { user } = useTypedSelector((state) => state.auth);
  return (
    <div className="w-full">
      <DashboardHeader
        title={`Welcome back ${user?.name || "Void"}`}
        subtitle="This is your overview report for the selected period"
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <DashboardStats dateRange={dateRange}/>
    </div>
  );
}

export default DashboardSummary;
