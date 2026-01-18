export const _TRANSACTION_FREQUENCY = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEAR: "YEAR",
} as const;

export const _TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type _TransactionType = keyof typeof _TRANSACTION_TYPE;

export const PAYMENT_METHODS_ENUM = {
  CARD: "CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
  CASH: "CASH",
  AUTO_DEBIT: "AUTO_DEBIT",
  OTHER: "OTHER",
} as const;
