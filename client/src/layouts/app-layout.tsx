import Navbar from "@/components/navbar";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <div className="min-h-screen pb-10">
        <Navbar />
        <main className="w-full max-w-full">
          <Outlet />
        </main>
      </div>
      <EditTransactionDrawer />
    </>
  );
}
