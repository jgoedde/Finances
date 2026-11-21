import { transactionInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    moveAttachedExpenses,
    resolveMainExpense,
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
                return c.json({ error: "unknown_category" as const }, 422);
            }
            if (category.kind !== input.kind) {
                return c.json(
                    { error: "category_kind_mismatch" as const },
                    422,
                );
            }

            const resolved = await resolveMainExpense(trx, userId, id, input);
            if ("error" in resolved) {
                return c.json({ error: resolved.error }, 422);
            }
            const { main, hasAttached } = resolved;

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
                await moveAttachedExpenses(trx, userId, id, {
                    date: row.date,
                    updatedAt: row.updated_at,
                });
            }
            return c.json(toTransaction(row));
        });
    },
);
