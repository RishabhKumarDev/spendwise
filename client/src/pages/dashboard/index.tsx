import PageLayout from "@/components/page-layout";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col">
      <PageLayout className="space-y-6" renderPageHeader={<Dashboard} >
        {/* Dashboard main section(charts) */}

        {/* Dashboard Transaction */}
      </PageLayout>
    </div>
  );
}
