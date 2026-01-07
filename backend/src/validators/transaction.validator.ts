import { z } from "zod";
import {
  PaymentMethodEnum,
  RecurringIntervalEnum,
  TransactionTypeEnum,
} from "../models/transaction.model";
import mongoose from "mongoose";

const typeSchema = z.enum(
  [TransactionTypeEnum.INCOME, TransactionTypeEnum.EXPENSE],
  {
    errorMap: () => ({
      message: "Transaction type must be either INCOME or EXPENSE",
    }),
  }
);

const paymentMethodSchema = z
  .enum([
    PaymentMethodEnum.AUTO_DEBIT,
    PaymentMethodEnum.BANK_TRANSFER,
    PaymentMethodEnum.CARD,
    PaymentMethodEnum.CASH,
    PaymentMethodEnum.MOBILE_PAYMENT,
    PaymentMethodEnum.OTHER,
  ])
  .default(PaymentMethodEnum.CASH);

const dateSchema = z
  .union([z.string().datetime({ message: "Invalid Date String" }), z.date()])
  .transform((val) => new Date(val));

const recurringIntervalSchema = z
  .enum([
    RecurringIntervalEnum.DAILY,
    RecurringIntervalEnum.WEEKLY,
    RecurringIntervalEnum.MONTHLY,
    RecurringIntervalEnum.YEARLY,
  ])
  .nullable()
  .optional();

export const baseTransactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: typeSchema,
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: dateSchema,
  paymentMethod: paymentMethodSchema,
  isRecurring: z.coerce.boolean().default(false),
  recurringInterval: recurringIntervalSchema,
  receiptUrl: z.string().optional(),
});

export const createTransactionSchema = baseTransactionSchema;
export const updateTransactionSchema = baseTransactionSchema.partial();
export const bulkCreateTransactionSchema = z
  .object({
    transactions: z
      .array(baseTransactionSchema)
      .min(1, "At least one Transaction is needed")
      .max(300, "Can't be more than 300 transactions"),
  })
  .strict();

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionType = z.infer<typeof updateTransactionSchema>;
export type BulkCreateTransactionType = z.infer<
  typeof bulkCreateTransactionSchema
>;

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const transactionQuerySchema = z.object({
  keyword: z.string().optional(),
  type: z.preprocess(
    emptyStringToUndefined,
    z.nativeEnum(TransactionTypeEnum).optional()
  ),
  recurringStatus: z.preprocess(
    emptyStringToUndefined,
    z.enum(["RECURRING", "NON_RECURRING"]).optional()
  ),

  pageSize: z.coerce.number().int().positive().default(20),
  pageNumber: z.coerce.number().int().positive().default(1),
});

export type TransactionQueryType = z.infer<typeof transactionQuerySchema>;

export type TransactionPaginationType = Pick<
  TransactionQueryType,
  "pageSize" | "pageNumber"
>;
export type TransactionFilterType = Omit<
  TransactionQueryType,
  keyof TransactionPaginationType
>;

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Param ID format",
  });

export const bulkDeleteTransactionSchema = z
  .object({
    transactionIds: z
      .array(objectIdSchema)
      .min(1, "At least One Id is required"),
  })
  .strict();
