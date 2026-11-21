import { transactionInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    toLocationColumns,
    toTransaction,
    transactionIdParam,
} from "#/features/transactions/transactions.ts";

/**
 * Create or replace (last write wins). Idempotent, so offline clients can
 * replay it. Writes to a deleted id are ignored. Attached expenses take
 * their main expense's date, and a main expense's date moves its attached
 * expenses along (ADR 0008).
 */
export const putTransaction = factory.createHandlers(
    validate("param", transactionIdParam),
    validate("json", transactionInputSchema),
    async (c) => {
        const userId = c.var.userId;
        const { id } = c.req.valid("param");
        const input = c.req.valid("json");

        return c.var.db.transaction().execute(async (trx) => {
            const tombstone = await trx
                .selectFrom("transaction_tombstones")
                .select("id")
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .executeTakeFirst();
            if (tombstone) {
                logger.debug(
                    { userId, transactionId: id },
                    "Ignored write to a deleted transaction",
                );
                return c.body(null, 204);
            }

            const category = await trx
                .selectFrom("categories")
                .select("kind")
                .where("user_id", "=", userId)
                .where("id", "=", input.categoryId)
                .executeTakeFirst();
            if (!category) {
                return c.json({ error: "unknown_category" }, 422);
            }
            if (category.kind !== input.kind) {
                return c.json({ error: "category_kind_mismatch" }, 422);
            }

            const hasAttached =
                (await trx
                    .selectFrom("transactions")
                    .select("id")
                    .where("user_id", "=", userId)
                    .where("main_expense_id", "=", id)
                    .executeTakeFirst()) !== undefined;
            if (hasAttached && input.kind !== "expense") {
                return c.json({ error: "main_expense_kind" }, 422);
            }

            let main: { id: string; date: number } | undefined;
            if (input.mainExpenseId !== null) {
                if (input.kind !== "expense" || input.mainExpenseId === id) {
                    return c.json({ error: "invalid_main_expense" }, 422);
                }
                const row = await trx
                    .selectFrom("transactions")
                    .select(["id", "date", "kind", "main_expense_id"])
                    .where("user_id", "=", userId)
                    .where("id", "=", input.mainExpenseId)
                    .executeTakeFirst();
                if (row) {
                    // One level deep, expenses only (ADR 0008).
                    if (
                        row.kind !== "expense" ||
                        row.main_expense_id !== null ||
                        hasAttached
                    ) {
                        return c.json({ error: "invalid_main_expense" }, 422);
                    }
                    main = row;
                }
            }

            const values = {
                // An attached expense is always on its main expense's day.
                date: main?.date ?? input.date,
                counterparty: input.counterparty,
                description: input.description,
                kind: input.kind,
                amount: input.amount,
                currency: input.currency,
                category_id: input.categoryId,
                exceptional: input.exceptional ? 1 : 0,
                ...toLocationColumns(input.location),
                // A deleted or unknown main expense leaves a regular expense.
                main_expense_id: main?.id ?? null,
                updated_at: Date.now(),
            } as const;

            const row = await trx
                .insertInto("transactions")
                .values({ user_id: userId, id, ...values })
                .onConflict((oc) =>
                    oc.columns(["user_id", "id"]).doUpdateSet(values),
                )
                .returningAll()
                .executeTakeFirstOrThrow();
            if (hasAttached) {
                await trx
                    .updateTable("transactions")
                    .set({ date: row.date, updated_at: row.updated_at })
                    .where("user_id", "=", userId)
                    .where("main_expense_id", "=", id)
                    .where("date", "<>", row.date)
                    .execute();
            }
            return c.json(toTransaction(row));
        });
    },
);
