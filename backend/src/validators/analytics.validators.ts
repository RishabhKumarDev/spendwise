import { z } from "zod";
import { DateRangeEnum } from "../enums/date-range.enum";

const dateSchema = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }
    return val;
  },
  z
    .union([
      z.string().datetime({ message: "Invalid Date String" }),
      z.date(),
      z.undefined(),
    ])
    .transform((val) => (val ? new Date(val) : undefined))
);


export const summaryAnalyticsQuerySchema = z.object({
  preset: z.nativeEnum(DateRangeEnum).optional(),
  from: dateSchema.optional(),
  to: dateSchema.optional(),
});
