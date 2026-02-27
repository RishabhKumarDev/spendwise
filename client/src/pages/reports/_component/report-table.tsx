import { useGetAllReportsQuery } from "@/features/report/reportApi";
import DataTable from "@/components/data-table";
import { reportColumns } from "@/pages/reports/_component/column";
import { useState } from "react";

function ReportTable() {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isFetching} = useGetAllReportsQuery(filter);

  const pagination = {
      totalItems: data?.data?.pagination?.totalCount || 0,
      totalPages: data?.data?.pagination?.totalPage || 0,
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
  }

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  return (
    <DataTable
      data={data?.data.reports || []}
      columns={reportColumns}
      isLoading={isFetching}
      showSearch={false}
      className="[&_td]:!w-[5%]"
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}

export default ReportTable;
