import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  setDay,
  startOfMonth,
} from "date-fns";
import { RecurringIntervalEnum } from "../models/transaction.model";

export const createNextReportDate = (lastSentDate?: Date | null): Date => {
  const now = new Date();
  const lastSent = lastSentDate || now;

  const nextDate = startOfMonth(addMonths(lastSent, 1));
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
};

export const calculateNextOccurance = (
  date: Date,
  recurringInterval: RecurringIntervalEnum
) => {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  switch (recurringInterval) {
    case RecurringIntervalEnum.DAILY:
      return addDays(base, 1);
    case RecurringIntervalEnum.WEEKLY:
      return addWeeks(base, 1);
    case RecurringIntervalEnum.MONTHLY:
      return addMonths(base, 1);
    case RecurringIntervalEnum.YEARLY:
      return addYears(base, 1);
    default:
      return base;
  }
};
