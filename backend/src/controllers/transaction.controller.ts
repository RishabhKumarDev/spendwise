import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import {
  bulkCreateTransactionSchema,
  bulkDeleteTransactionSchema,
  createTransactionSchema,
  objectIdSchema,
  transactionQuerySchema,
  TransactionQueryType,
  updateTransactionSchema,
} from "../validators/transaction.validator";
import {
  bulkDeleteTransactionService,
  bulkInsertTransactionService,
  createTransactionService,
  deleteTransactionService,
  duplicateTransactionService,
  getAllTransactionService,
  getTransactionByIdService,
  updateTransactionService,
} from "../services/transaction.service";

export const createTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createTransactionSchema.parse(req.body);
    const userId = req.user?._id;

    const transaction = await createTransactionService(userId, body);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Transaction Created Successfully",
      data: {
        transaction,
      },
    });
  }
);

export const getAllTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const parsed = transactionQuerySchema.parse(req.query);

    const { pageSize, pageNumber, ...filters }: TransactionQueryType = parsed;
    const pagination = { pageNumber, pageSize };

    const result = await getAllTransactionService(userId, filters, pagination);

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction fetched successfully",
      data: { ...result },
    });
  }
);

export const getTransactionById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const transactionId = objectIdSchema.parse(req.params.id);

    const transaction = await getTransactionByIdService(userId, transactionId);

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction fetched sucessfully",
      data: { transaction },
    });
  }
);

export const duplicateTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const transactionId = objectIdSchema.parse(req.params.id);

    const transaction = await duplicateTransactionService(
      userId,
      transactionId
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: "Transaction duplicated sucessfully",
      data: { transaction },
    });
  }
);

export const updateTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const transactionId = objectIdSchema.parse(req.params.id);
    const body = updateTransactionSchema.parse(req.body);

    await updateTransactionService(userId, transactionId, body);

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction updated sucessfully",
    });
  }
);

export const deleteTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const transactionId = objectIdSchema.parse(req.params.id);

    await deleteTransactionService(userId, transactionId);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Transaction deleted sucessfully" });
  }
);

export const bulkDeleteTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { transactionIds } = bulkDeleteTransactionSchema.parse(req.body);

    const result = await bulkDeleteTransactionService(userId, transactionIds);

    res.status(HTTP_STATUS.OK).json({
      message: "Transactions deleted sucessfully",
      data: { ...result },
    });
  }
);

export const bulkTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { transactions } = bulkCreateTransactionSchema.parse(req.body);

    const result = await bulkInsertTransactionService(userId, transactions);

    res
      .status(HTTP_STATUS.CREATED)
      .json({
        message: "Transactions created successfully",
        data: { ...result },
      });
  }
);
