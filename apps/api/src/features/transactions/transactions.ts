import { z } from "zod";
import { type Transaction, transactionIdSchema } from "@finances/shared";
import type { TransactionsTable } from "#/db/schema.ts";

export const transactionIdParam = z.object({ id: transactionIdSchema });

export function toTransaction(row: TransactionsTable): Transaction {
    return {
        id: row.id,
        date: row.date,
        name: row.name,
        description: row.description,
        kind: row.kind,
        amount: Number(row.amount),
        currency: row.currency,
        categoryId: row.category_id,
        exceptional: row.exceptional === 1,
    };
}

/**
 * Wraps a search term in `%` and escapes `%`, `_` and the backslash.
 */
export function toLikePattern(term: string): string {
    return `%${term.replace(/[\\%_]/g, "\\$&")}%`;
}
