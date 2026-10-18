import { transactionInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { logger } from "#/log.ts";
import {
    toTransaction,
    transactionIdParam,
} from "#/features/transactions/transactions.ts";

/**
 * Create or replace (last write wins). Idempotent, so offline clients can
 * replay it. Writes to a deleted id are ignored.
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
                .select("id")
                .where("user_id", "=", userId)
                .where("id", "=", input.categoryId)
                .executeTakeFirst();
            if (!category) {
                return c.json({ error: "unknown_category" }, 422);
            }

            const values = {
                date: input.date,
                name: input.name,
                description: input.description,
                kind: input.kind,
                amount: input.amount,
                currency: input.currency,
                category_id: input.categoryId,
                exceptional: input.exceptional ? 1 : 0,
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
            return c.json(toTransaction(row));
        });
    },
);
