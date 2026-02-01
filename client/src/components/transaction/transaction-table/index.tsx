import { _TransactionType } from "@/constant";
import { useState } from "react";
import useDebouncedSearch from "@/hooks/use-debounce-search";
// import {
//   useBulkDeleteTransactionMutation,
//   useGetAllTransactionsQuery,
// } from "@/features/transaction/transactionApi";
// import { toast } from "sonner";

type FilterType = {
  type?: _TransactionType | undefined;
  recurringStatus?: "RECURRING" | "NON_RECURRING" | undefined;
  pageNumber?: number;
  pageSize?: number;
};
function TransactioinTable({
  pageSize,
  isShowPagination,
}: {
  pageSize?: number;
  isShowPagination?: boolean;
}) {
  const [filter, setFilter] = useState<FilterType>({
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: pageSize || 10,
  });

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch("", {
    delay: 500,
  });

  /*

   const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: debouncedTerm,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  });

 const transactions = data?.data?.transactions || [];

const pagination = {
  totalItems: data?.data?.pagination?.totalCount || 0,
  totalPages: data?.data?.pagination?.totalPages || 0,
  pageNumber: data?.data?.pagination?.pageNumber ?? filter.pageNumber,
  pageSize: data?.data?.pagination?.pageSize ?? filter.pageSize,
};

*/

  const pagination = {
    totalItem: 20,
    totalPages: 1,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter: Record<string, string>) => {
    const { type, frequently } = filter;
    setFilter((prev) => ({
      ...prev,
      type: type as _TransactionType,
      recurringStatus: frequently as "RECURRING" | "NON_RECURRING",
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };
  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };
  /*
  const handleBulkDelete = async (transactionIds: string[]) => {
    try {
      await bulkDeleteTransaction(transactionIds).unwrap();
      toast.success("Transactions deleted successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.data?.message || "Failed to delete transactions",
      );
    }
  };

*/


  return (
    <DataTable
      data={TRANSACTION_DATA} //transactions
      columns={transactionColumns}
      searchPlaceholder="Search transactions..."
      isLoading={false}
      isBulkDeleting={false}
      isShowPagination={props.isShowPagination}
      pagination={pagination}
      filters={[
        {
          key: "type",
          label: "All Types",
          options: [
            { value: _TRANSACTION_TYPE.INCOME, label: "Income" },
            { value: _TRANSACTION_TYPE.EXPENSE, label: "Expense" },
          ],
        },
        {
          key: "frequently",
          label: "Frequently",
          options: [
            { value: "RECURRING", label: "Recurring" },
            { value: "NON_RECURRING", label: "Non-Recurring" },
          ],
        },
      ]}
      onSearch={handleSearch}
      onPageChange={(pageNumber) => handlePageChange(pageNumber)}
      onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
      onFilterChange={(filters) => handleFilterChange(filters)}
      onBulkDelete={handleBulkDelete}
    />
  );
}

export default TransactioinTable;
