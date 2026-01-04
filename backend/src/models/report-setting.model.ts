import mongoose, { Schema } from "mongoose";

export enum ReportFrequencyEnum {
  MONTHLY = "MONTHLY",
}

export interface ReportSettingDocument {
  userId: mongoose.Types.ObjectId;
  frequency: ReportFrequencyEnum;
  isEnabled: boolean;
  nextReportDate?: Date | null;
  lastSentDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const reportSettingSchema = new Schema<ReportSettingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    frequency: {
      type: String,
      enum: Object.values(ReportFrequencyEnum),
      default: ReportFrequencyEnum.MONTHLY,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    nextReportDate: {
      type: Date,
      default: null,
    },
    lastSentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ReportSettingModel = mongoose.model<ReportSettingDocument>(
  "ReportSetting",
  reportSettingSchema
);
export default ReportSettingModel;
