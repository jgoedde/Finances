import { z } from "zod";
import {
    canAttachTo,
    type Transaction,
    type TransactionInput,
    transactionIdSchema,
} from "@finances/shared";
import type { DB } from "#/db/database.ts";
import type { TransactionsTable } from "#/db/schema.ts";

export const transactionIdParam = z.object({ id: transactionIdSchema });

export function toTransaction(row: TransactionsTable): Transaction {
    return {
        id: row.id,
        date: row.date,
        counterparty: row.counterparty,
        description: row.description,
        kind: row.kind,
        amount: Number(row.amount),
        currency: row.currency,
        categoryId: row.category_id,
        exceptional: row.exceptional === 1,
        location:
            row.location_lat !== null &&
            row.location_lng !== null &&
            row.location_accuracy !== null
                ? {
                      lat: row.location_lat,
                      lng: row.location_lng,
                      accuracy: row.location_accuracy,
                  }
                : null,
        mainExpenseId: row.main_expense_id,
    };
}

/**
 * The location as stored in the `location_*` columns.
 */
export function toLocationColumns(location: Transaction["location"]) {
    return {
        location_lat: location?.lat ?? null,
        location_lng: location?.lng ?? null,
        location_accuracy: location?.accuracy ?? null,
    };
}

/**
 * Wraps a search term in `%` and escapes `%`, `_` and the backslash.
 */
export function toLikePattern(term: string): string {
    return `%${term.replace(/[\\%_]/g, "\\$&")}%`;
}

/**
 * What saving `input` under `id` means for main expenses (ADR 0008): the main
 * expense it is attached to (`undefined` if none, or if it's deleted or
 * unknown, which leaves a regular expense) and whether expenses are attached
 * to it. Fails with an error code if the reference breaks the rules.
 */
export async function resolveMainExpense(
    db: DB,
    userId: string,
    id: string,
    input: TransactionInput,
): Promise<
    | {
          main: { id: string; date: number } | undefined;
          hasAttached: boolean;
      }
    | { error: "main_expense_kind" | "invalid_main_expense" }
> {
    const hasAttached =
        (await db
            .selectFrom("transactions")
            .select("id")
            .where("user_id", "=", userId)
            .where("main_expense_id", "=", id)
            .executeTakeFirst()) !== undefined;
    if (hasAttached && input.kind !== "expense") {
        return { error: "main_expense_kind" };
    }
    if (input.mainExpenseId === null) {
        return { main: undefined, hasAttached };
    }

    // An income or a reference to itself fails even without a main expense.
    const written = { id, kind: input.kind };
    if (
        !canAttachTo(written, {
            id: input.mainExpenseId,
            kind: "expense",
            mainExpenseId: null,
        })
    ) {
        return { error: "invalid_main_expense" };
    }
    const row = await db
        .selectFrom("transactions")
        .select(["id", "date", "kind", "main_expense_id"])
        .where("user_id", "=", userId)
        .where("id", "=", input.mainExpenseId)
        .executeTakeFirst();
    if (!row) {
        return { main: undefined, hasAttached };
    }
    // One level deep: neither of them may have a main expense of its own.
    if (
        hasAttached ||
        !canAttachTo(written, {
            id: row.id,
            kind: row.kind,
            mainExpenseId: row.main_expense_id,
        })
    ) {
        return { error: "invalid_main_expense" };
    }
    return { main: row, hasAttached };
}

/**
 * Moves the expenses attached to `id` to its `date`.
 */
export async function moveAttachedExpenses(
    db: DB,
    userId: string,
    id: string,
    { date, updatedAt }: { date: number; updatedAt: number },
): Promise<void> {
    await db
        .updateTable("transactions")
        .set({ date, updated_at: updatedAt })
        .where("user_id", "=", userId)
        .where("main_expense_id", "=", id)
        .where("date", "<>", date)
        .execute();
}

/**
 * The main expenses that attached expenses among `transactions` reference,
 * unless they are among `transactions` themselves.
 */
export async function readMissingMainExpenses(
    db: DB,
    userId: string,
    transactions: Transaction[],
): Promise<Transaction[]> {
    const ids = new Set(transactions.map((it) => it.id));
    const missingIds = [
        ...new Set(
            transactions.flatMap((it) =>
                it.mainExpenseId !== null && !ids.has(it.mainExpenseId)
                    ? [it.mainExpenseId]
                    : [],
            ),
        ),
    ];
    if (missingIds.length === 0) {
        return [];
    }
    const rows = await db
        .selectFrom("transactions")
        .selectAll()
        .where("user_id", "=", userId)
        .where("id", "in", missingIds)
        .execute();
    return rows.map(toTransaction);
}
