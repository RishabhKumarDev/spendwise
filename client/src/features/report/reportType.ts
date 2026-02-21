interface Pagination {
  totalCount: number;
  totalPage: number;
  pageSize: number;
  skip: number;
  pageNumber: number;
}
export enum ReportStatusEnum {
  SENT = "SENT",
  PENDING = "PENDING",
  FAILED = "FAILED",
  NO_ACTIVITY = "NO_ACTIVITY",
}
export interface ReportType {
  _id: string;
  userId: string;
  period: string;
  sentDate: string;
  status: ReportStatusEnum;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface GetAllReportsResponse {
  message: string;
  data: {
    reports: ReportType[];
    pagination: Pagination;
  };
}

export interface UpdateReportSettingParams {
    isEnabled: boolean;
}