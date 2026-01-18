import mongoose, { Schema } from "mongoose";

export enum ReportStatusEnum {
  SENT = "SENT",
  PENDING = "PENDING",
  FAILED = "FAILED",
  NO_ACTIVITY = "NO_ACTIVITY",
}
export interface ReportDocument {
  userId: mongoose.Types.ObjectId;
  period: string;
  sentDate: Date;
  status: ReportStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    sentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatusEnum),
      default: ReportStatusEnum.PENDING,
    },
  },
  { timestamps: true }
);

const ReportModel = mongoose.model<ReportDocument>("Report", reportSchema);

export default ReportModel;
