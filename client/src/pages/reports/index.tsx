import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import ReportTable from "@/pages/reports/_component/report-table";
import ScheduleReportDrawer from "@/pages/reports/_component/schedule-report-drawer";

export default function Reports() {
  return (
    <PageLayout
      title="Report History"
      subtitle="View and manage your financial reports"
      addMarginTop
      rightAction={<ScheduleReportDrawer />}
    >
      <Card className="border shadow-none">
        <CardContent>
          <ReportTable />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
