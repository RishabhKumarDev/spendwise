import axios from "axios";
import TransactionModel from "../models/transaction.model";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../utils/app-error";
import { calculateNextOccurance } from "../utils/helper";
import {
  CreateTransactionType,
  TransactionFilterType,
  TransactionPaginationType,
  UpdateTransactionType,
} from "../validators/transaction.validator";
import { genAI, genAiModel } from "../config/google-ai.config";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { receiptPrompt } from "../utils/prompt";

export const createTransactionService = async (
  userId: string,
  body: CreateTransactionType
) => {
  let nextRecurringDate: Date | undefined;
  let currentDate = new Date();

  if (body.isRecurring && body.recurringInterval) {
    const calculatedDate = calculateNextOccurance(
      body.date,
      body.recurringInterval
    );

    nextRecurringDate =
      calculatedDate < currentDate
        ? calculateNextOccurance(currentDate, body.recurringInterval)
        : calculatedDate;
  }

  const transaction = await TransactionModel.create({
    ...body,
    userId,
    amount: Number(body.amount),
    isRecurring: body.isRecurring || false,
    recurringInterval: body.recurringInterval || null,
    nextRecurringDate,
    lastProcessed: null,
  });

  return transaction;
};

export const getAllTransactionService = async (
  userId: string,
  filters: TransactionFilterType,
  pagination: TransactionPaginationType
) => {
  const { keyword, recurringStatus, type } = filters;

  let queryCondition: Record<string, any> = { userId };
  if (keyword) {
    queryCondition.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  if (type) {
    queryCondition.type = type;
  }

  if (recurringStatus) {
    if (recurringStatus === "RECURRING") {
      queryCondition.isRecurring = true;
    } else if (recurringStatus === "NON_RECURRING") {
      queryCondition.isRecurring = false;
    }
  }

  const { pageNumber, pageSize } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [transactions, totalCount] = await Promise.all([
    TransactionModel.find(queryCondition)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    TransactionModel.countDocuments(queryCondition),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    transactions,
    pagination: {
      totalCount,
      totalPages,
      pageNumber,
      pageSize,
      skip,
    },
  };
};

export const getTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new NotFoundException("Transaction not found");
  }

  return transaction;
};

export const duplicateTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await getTransactionByIdService(userId, transactionId);

  const dublicatedTr = await TransactionModel.create({
    ...transaction.toObject(),
    _id: undefined,
    title: `Duplicate - ${transaction.title}`,
    description: transaction.description
      ? `${transaction.description} - ( Duplicate )`
      : "Duplicated transaction",
    isRecurring: false,
    recurringInterval: undefined,
    nextRecurringDate: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

};

export const updateTransactionService = async (
  userId: string,
  transactionId: string,
  body: UpdateTransactionType
) => {
  const existingTransaction = await getTransactionByIdService(
    userId,
    transactionId
  );

  const now = new Date();
  const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;
  const date =
    body.date !== undefined ? new Date(body.date) : existingTransaction.date;
  const recurringInterval =
    body.recurringInterval ?? existingTransaction.recurringInterval;

  let nextRecurringDate: Date | undefined;

  if (isRecurring && recurringInterval) {
    const calculatedDate = calculateNextOccurance(date, recurringInterval);

    nextRecurringDate =
      calculatedDate < now
        ? calculateNextOccurance(now, recurringInterval)
        : calculatedDate;
  }

  const updates = Object.fromEntries(
    Object.entries(body).filter(([_, v]) => v !== undefined)
  );

  existingTransaction.set({
    ...updates,
    date,
    isRecurring,
    nextRecurringDate,
    recurringInterval,
  });

  await existingTransaction.save();
};

export const deleteTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new NotFoundException("Transaction doesn't exists");
  }

  return;
};

export const bulkDeleteTransactionService = async (
  userId: string,
  transactionIds: string[]
) => {
  const transactions = await TransactionModel.deleteMany({
    _id: { $in: transactionIds },
    userId,
  });

  if (transactions.deletedCount === 0) {
    throw new NotFoundException("No transaction found");
  }

  return {
    sucess: true,
    deleteCount: transactions.deletedCount,
  };
};

export const bulkInsertTransactionService = async (
  userId: string,
  transactions: CreateTransactionType[]
) => {
  try {
    const bulkOps = transactions.map((tx) => ({
      insertOne: {
        document: {
          ...tx,
          userId,
          isRecurring: false,
          nextRecurringDate: null,
          recurringInterval: null,
          lastProcessed: null,
          createdAt: new Date(),
          updateAt: new Date(),
        },
      },
    }));

    const result = await TransactionModel.bulkWrite(bulkOps, { ordered: true });

    return {
      insertCount: result.insertedCount,
      sucess: true,
    };
  } catch (error) {
    throw error;
  }
};

export const scanReceiptService = async (
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequestException("File is Missing");
  }

  try {
    if (!file.path) {
      throw new InternalServerException(
        "Failed to Upload Image. Please try again"
      );
    }

    const responseData = await axios.get(file.path, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(responseData.data).toString("base64");

    if (!base64String) {
      throw new InternalServerException("Couldn't process file");
    }

    const result = await genAI.models.generateContent({
      model: genAiModel,
      contents: [
        createUserContent([
          receiptPrompt,
          createPartFromBase64(base64String, file.mimetype),
        ]),
      ],
      config: { temperature: 0, topP: 1, responseMimeType: "application/json" },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

    if (!cleanedText) {
      return {
        error: "Couldn't read recipt context",
      };
    }

    const data = JSON.parse(cleanedText);

    if (!data.amount || !data.date) {
      return { error: "Reciept missing required information" };
    }

    return {
      title: data.title || "Reciept",
      amount: data.amount,
      date: data.date,
      description: data.description,
      category: data.category,
      paymentMethod: data.paymentMethod,
      type: data.type,
      receiptUrl: file.path,
    };
  } catch (error:any) {
   const message = error?.message || "";

  if (
    error?.status === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded")
  ) {
    throw new Error("AI free limit exceeded. Please upgrade your plan or try again later.");
  }

  throw error; // rethrow unknown errors
  }
};
