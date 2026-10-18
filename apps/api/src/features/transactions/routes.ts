import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { deleteTransaction } from "#/features/transactions/delete-transaction.ts";
import { getTransaction } from "#/features/transactions/get-transaction.ts";
import { listTransactions } from "#/features/transactions/list-transactions.ts";
import { putTransaction } from "#/features/transactions/put-transaction.ts";
import { searchTransactions } from "#/features/transactions/search-transactions.ts";

export const transactionRoutes = new Hono<AppEnv>()
    .get("/", ...listTransactions)
    .get("/search", ...searchTransactions)
    .get("/:id", ...getTransaction)
    .put("/:id", ...putTransaction)
    .delete("/:id", ...deleteTransaction);
