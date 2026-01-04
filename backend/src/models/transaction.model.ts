import mongoose, { Schema } from "mongoose";
import { convertFromCents, convertToCents } from "../utils/format-currency";

export enum TransactionTypeEnum {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum RecurringIntervalEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum StatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentMethodEnum {
  CARD = "CARD",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  AUTO_DEBIT = "AUTO_DEBIT",
  OTHER = "OTHER",
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
}

export interface TransactionDocument {
  userId: mongoose.Types.ObjectId;
  type:  TransactionTypeEnum;
  title: string;
  amount: number;
  category: string;
  receiptUrl?: string;
  recurringInterval?: RecurringIntervalEnum | null;
  nextRecurringDate?: Date | null;
  isRecurring: boolean;
  lastProcessed?: Date | null;
  description?: string;
  date: Date;
  status:  StatusEnum;
  paymentMethod:  PaymentMethodEnum;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount can't be Negative"],
      set: (amount: number) => convertToCents(amount),
      get: (amount: number) => convertFromCents(amount),
    },
    description: {
      type: String,
    },
    receiptUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: Object.values(RecurringIntervalEnum),
      default: null,
    },
    nextRecurringDate: {
      type: Date,
      default: null,
    },
    lastProcessed: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(StatusEnum),
      default: StatusEnum.COMPLETED,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      default: PaymentMethodEnum.CASH,
    },
  },
  {
    timestamps: true,
    // these config will make sure the getter function runs when converted to any of the format, needed cuz getter doesn't run unless we call the field;
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

const TransactionModel = mongoose.model<TransactionDocument>("Transaction", transactionSchema);

export default TransactionModel;
