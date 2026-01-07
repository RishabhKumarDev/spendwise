import { Router } from "express";
import {
  bulkDeleteTransaction,
  bulkTransaction,
  createTransaction,
  deleteTransaction,
  duplicateTransaction,
  getAllTransaction,
  getTransactionById,
  updateTransaction,
} from "../controllers/transaction.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const transactionRouter = Router({ mergeParams: true });

transactionRouter.use(passportAuthenticateJwt);

transactionRouter.route("/create").post(createTransaction);
transactionRouter.route("/all").get(getAllTransaction);

transactionRouter.route("/duplicate/:id").post(duplicateTransaction);
transactionRouter.route("/update/:id").patch(updateTransaction);

transactionRouter.route("/delete/:id").delete(deleteTransaction);

transactionRouter.route("/bulk-delete").delete(bulkDeleteTransaction);
transactionRouter.route("/bulk-transaction").post(bulkTransaction);

transactionRouter.route("/:id").get(getTransactionById);

export default transactionRouter;
