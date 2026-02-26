import {
  _TRANSACTION_FREQUENCY,
  _TransactionType,
  PAYMENT_METHODS_ENUM,
} from "@/constant";

type RecurringIntervalType =
  (typeof _TRANSACTION_FREQUENCY)[keyof typeof _TRANSACTION_FREQUENCY];
type PaymentMethodType =
  (typeof PAYMENT_METHODS_ENUM)[keyof typeof PAYMENT_METHODS_ENUM];

export interface CreateTransactionBody {
  title: string;
  description: string;
  type: _TransactionType;
  amount: number;
  category: string;
  date: string;
  paymentMethod: PaymentMethodType;
  isRecurring: boolean;
  recurringInterval?: RecurringIntervalType | null;
}

export interface GetAllTransactionParams {
  keyword?: string;
  type?: _TransactionType;
  recurringStatus?: "RECURRING" | "NON_RECURRING";
  pageSize?: number;
  pageNumber?: number;
}

export interface TransactionType {
  _id: string;
  userId: string;
  title: string;
  type: _TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  isRecurring: boolean;
  recurringInterval: RecurringIntervalType | null;
  nextRecurringDate: string | null;
  lastProcessed: string | null;
  status: string;
  paymentMethod: PaymentMethodType;
  createdAt: string;
  updatedAt: string;
  id?: string;
}

export interface GetAllTransactionResponse {
  message: string;
  data: {
    transactions: TransactionType[];
    pagination: {
      totalCount: number;
      totalPages: number;
      pageNumber: number;
      pageSize: number;
      skip: number;
    };
  };
}

export interface GetSingleTransactionResponse {
  message: string;
  data: TransactionType;
}

export interface UpdateTransactionPayload {
  id: string;
  payload: CreateTransactionBody;
}


export interface AIScanReceiptData {
  title: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  paymentMethod: PaymentMethodType;
  type: "INCOME" | "EXPENSE";
  receiptUrl: string;
}

export interface AIScanReceiptResponse {
  message: string;
  data: AIScanReceiptData;
}

export interface BulkTransactionType {
  title: string;
  type: _TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethodType;
  isRecurring: boolean;
}

export interface BulkImportTransactionPayload {
  transactions: BulkTransactionType[];
}
