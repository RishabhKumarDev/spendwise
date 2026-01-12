import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import ReportSettingModel from "../../models/report-setting.model";
import { UserDocument } from "../../models/user.model";
import mongoose from "mongoose";
import { generateReportService } from "../../services/report.service";
import ReportModel, { ReportStatusEnum } from "../../models/report.model";
import { createNextReportDate } from "../../utils/helper";
import { format } from "date-fns";
import { sendReportEmail } from "../../mailers/report.mailer";

export const processReportJob = async () => {
  const now = new Date();

  let processedCount = 0;
  let failedCount = 0;

  const from = startOfMonth(subMonths(now, 1));
  const to = endOfMonth(subMonths(now, 1));

  try {
    const reportSettingCursor = ReportSettingModel.find({
      isEnabled: true,
      nextReportDate: { $lte: now },
    })
      .populate<{ userId: UserDocument }>("userId")
      .cursor();

    for await (const setting of reportSettingCursor) {
      const user = setting.userId;

      if (!user) {
        console.log(`user not found for setting: ${setting.id}`);
        continue;
      }

      const session = await mongoose.startSession();
      try {
        const report = await generateReportService(user.id, from, to);
  
        console.log(report, "Report Data 🙋🏻‍♀️")
        let emailSent = false;
        if (report) {
          try {
            sendReportEmail({
              email: user.email,
              username: user.name,
              frequency: setting.frequency,
              report: {
                availableBalance: report.summary.balance,
                insights: report.insights,
                period: report.period,
                savingsRate: report.summary.savingsRate,
                topCategories: report.summary.topCategories,
                totalExpense: report.summary.expense,
                totalIncome: report.summary.income,
              },
            });
            emailSent = true;
          } catch (error) {
            console.log(`Email Failed For User:${user.id}`);
          }
        }

        await session.withTransaction(
          async () => {
            const bulkReports: any[] = [];
            const bulkSettings: any[] = [];

            if (report && emailSent) {
              bulkReports.push({
                insertOne: {
                  document: {
                    userId: user.id,
                    period: report.period,
                    sentDate: now,
                    status: ReportStatusEnum.SENT,
                    createdAt: now,
                    updatedAt: now,
                  },
                },
              });
              bulkSettings.push({
                updateOne: {
                  filter: { _id: setting._id },

                  update: {
                    $set: {
                      lastSentDate: now,
                      nextReportDate: createNextReportDate(now),
                      updatedAt: now,
                    },
                  },
                },
              });
            } else {
              bulkReports.push({
                insertOne: {
                  document: {
                    userId: user.id,
                    period:
                      report?.period ||
                      `${format(from, "MMMM d")} - ${format(to, "d, yyyy")}`,
                    sentDate: now,
                    status: report
                      ? ReportStatusEnum.FAILED
                      : ReportStatusEnum.NO_ACTIVITY,
                    createdAt: now,
                    updatedAt: now,
                  },
                },
              });
              bulkSettings.push({
                updateOne: {
                  filter: { _id: setting._id },

                  update: {
                    $set: {
                      lastSentDate: null,
                      nextReportDate: createNextReportDate(now),
                      updatedAt: now,
                    },
                  },
                },
              });
            }

            await Promise.all([
              ReportSettingModel.bulkWrite(bulkSettings, {
                ordered: false,
                session,
              }),
              ReportModel.bulkWrite(bulkReports, { ordered: false, session }),
            ]);
          },
          { maxCommitTimeMS: 10000 }
        );
        processedCount++;
      } catch (error) {
        console.log(`Failed to Process report`, error);
        failedCount++;
      } finally {
        await session.endSession();
      }
    }

    console.log(`✅ Processed :${processedCount} Report`);
    console.log(`❌ Failed :${failedCount} Report`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error: any) {
    console.error(`Failed to Process Report`, error);
    return {
      success: false,
      error: error?.message || "Failed to Process Report",
    };
  }
};
