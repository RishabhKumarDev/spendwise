// import { useGetAllReportsQuery } from "@/features/report/reportApi";
import DataTable from "@/components/data-table";
import { reportColumns } from "@/pages/reports/_component/column";
import { REPORT_DATA } from "@/pages/reports/_component/data";
import { useState } from "react";

function ReportTable() {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  // const { data, isFetching} = useGetAllReportsQuery(filter);

  // const pagination = {
  //     totalItems: data?.data?.pagination?.totalCount || 0,
  //     totalPages: data?.data?.pagination?.totalPage || 0,
  //     pageNumber: filter.pageNumber,
  //     pageSize: filter.pageSize,
  // }

  const pagination = {
    totalItems: 0,
    totalPages: 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  return (
    <DataTable
      data={REPORT_DATA}
      columns={reportColumns}
      isLoading={false}
      showSearch={false}
      className="[&_td]:!w-[5%]"
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}

export default ReportTable;
