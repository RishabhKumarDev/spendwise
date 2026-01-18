import { apiClient } from "@/app/api-client";
import {
  ChartAnalyticsResponse,
  ExpensePieChartBreakdownResponse,
  FilterParams,
  SummaryAnalyticsResponse,
} from "@/features/analytics/analyticsType";

export const analyticsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    summaryAnalytics: builder.query<SummaryAnalyticsResponse, FilterParams>({
      query: ({ preset, from, to }) => ({
        url: "/analytics/summary",
        method: "GET",
        params: { preset, from, to },
      }),
      providesTags: ["analytics"],
    }),
    chartAnalytics: builder.query<ChartAnalyticsResponse, FilterParams>({
      query: ({ preset, from, to }) => ({
        url: "/analytics/chart",
        method: "GET",
        params: { preset, from, to },
      }),
      providesTags: ["analytics"],
    }),
    expenseBreakdownAnalytics: builder.query<
      ExpensePieChartBreakdownResponse,
      FilterParams
    >({
      query: ({ preset, from, to }) => ({
        url: "/analytics/expense-breakdown",
        method: "GET",
        params: { preset, from, to },
      }),
      providesTags: ["analytics"],
    }),
  }),
});

export const {
  useChartAnalyticsQuery,
  useExpenseBreakdownAnalyticsQuery,
  useSummaryAnalyticsQuery,
} = analyticsApi;
