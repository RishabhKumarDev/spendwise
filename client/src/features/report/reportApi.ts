import { apiClient } from "@/app/api-client";
import {
  GetAllReportsResponse,
  UpdateReportSettingParams,
} from "@/features/report/reportType";

export const reportApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query<
      GetAllReportsResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: (params) => {
        const { pageNumber = 1, pageSize = 20 } = params;

        return {
          url: "/report/all",
          method: "GET",
          params: { pageNumber, pageSize },
        };
      },
    }),

    updateReportSetting: builder.mutation<
      { message: string },
      UpdateReportSettingParams
    >({
      query: (payload) => ({
        url: "/report/update-setting",
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const { useGetAllReportsQuery, useUpdateReportSettingMutation } =
  reportApi;
