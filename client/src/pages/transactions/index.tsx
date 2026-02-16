import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import TransactioinTable from "@/components/transaction/transaction-table";
import { Card, CardContent } from "@/components/ui/card";

export default function Transactions() {
  return (
    <PageLayout
      title="All Transactions"
      subtitle="Showing all transactions"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <ImportTransactionModal />
          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactioinTable pageSize={20} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
