import { apiClient } from "@/app/api-client";
import {
  AIScanReceiptData,
  BulkImportTransactionPayload,
  CreateTransactionBody,
  GetAllTransactionParams,
  GetAllTransactionResponse,
  GetSingleTransactionResponse,
  UpdateTransactionPayload,
} from "@/features/transaction/transactionType";

export const transactionApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation<void, CreateTransactionBody>({
      query: (payload) => ({
        url: "/transaction/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["analytics", "transactions"],
    }),

    getAllTransactions: builder.query<
      GetAllTransactionResponse,
      GetAllTransactionParams
    >({
      query: (params) => {
        const {
          keyword = undefined,
          pageNumber = 1,
          pageSize = 20,
          recurringStatus = undefined,
          type = undefined,
        } = params;
        return {
          url: "/transaction/all",
          method: "GET",
          params: { keyword, pageNumber, pageSize, recurringStatus, type },
        };
      },
      providesTags: ["transactions"],
    }),

    getSingleTransaction: builder.query<GetSingleTransactionResponse, string>({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "GET",
      }),
    }),

    duplicateTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transaction/duplicate/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["transactions", "analytics"],
    }),

    updateTransaction: builder.mutation<void, UpdateTransactionPayload>({
      query: ({ id, payload }) => ({
        url: `/transaction/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["transactions"],
    }),

    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transaction/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactions", "analytics"],
    }),

    bulkDeleteTransaction: builder.mutation<void, string[]>({
      query: (transactionIds) => ({
        url: "/transaction/bulk-delete",
        method: "DELETE",
        body: { transactionIds },
      }),
      invalidatesTags: ["analytics", "transactions"],
    }),

    bulkImportTransaction: builder.mutation<void, BulkImportTransactionPayload>(
      {
        query: (body) => ({
          url: "/transaction/bulk-transaction",
          method: "POST",
          body,
        }),
        invalidatesTags: ["transactions", "analytics"],
      },
    ),

    aiScanReceipt: builder.mutation<AIScanReceiptData, FormData>({
      query: (formData) => ({
        url: "/transaction/scan-receipt",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});
