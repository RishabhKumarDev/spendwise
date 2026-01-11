import { z } from "zod";

export const reportPaginationSchema = z.object({
  pageSize: z.coerce.number().int().positive().default(20),
  pageNumber: z.coerce.number().int().positive().default(1),
});

export type ReportPaginationType = z.infer<typeof reportPaginationSchema>;

export const reportSettingSchema = z.object({
  isEnabled: z.boolean().default(true),
});

export const updateReportSettingSchema = reportSettingSchema.partial();

export type updateReportSettingType = z.infer<typeof updateReportSettingSchema>;
