import mongoose from "mongoose";
import TransactionModel from "../../models/transaction.model";
import { calculateNextOccurance } from "../../utils/helper";

export const processingRecurringTransaction = async () => {
  const now = new Date();
  let processedCount = 0;
  let failedCount = 0;
  try {
    const transactionCursor = TransactionModel.find({
      isRecurring: true,
      nextRecurringDate: { $lte: now },
    }).cursor();

    console.log("Starting recurring process");

    for await (const tx of transactionCursor) {
      const nextDate = calculateNextOccurance(
        tx.nextRecurringDate!,
        tx.recurringInterval!
      );
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(
          async () => {
            const obj = tx.toObject() as any;
            delete obj.__v;
            delete obj.updatedAt;
            delete obj.createdAt;
            delete obj._id;


            await TransactionModel.create(
              [
                {
                  ...obj,
                  title: `Recurring - ${obj.title}`,
                  isRecurring: false,
                  nextRecurringDate: null,
                  lastProcessed: null,
                  date: obj.nextRecurringDate,
                  recurringInterval: null,
                },
              ],
              { session }
            );

            await TransactionModel.findByIdAndUpdate(
              tx._id,
              {
                $set: {
                  nextRecurringDate: nextDate,
                  lastProcessed: now,
                },
              },
              { session }
            );
          },
          { maxCommitTimeMS: 20000 }
        );

        processedCount++;
      } catch (error: any) {
        console.log(`Failed recurring ts: ${tx._id}`, error?.message);
        failedCount++;
      } finally {
        session.endSession();
      }
    }

    console.log(`✅ Processed :${processedCount}`);
    console.log(`❌ Failed :${failedCount}`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error: any) {
    console.error(`Failed to Process Transaction`, error);
    return {
      success: false,
      error: error?.message || "Failed to Process Transaction",
    };
  }
};
