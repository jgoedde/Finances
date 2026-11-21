import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { transactionIdParam } from "#/features/transactions/transactions.ts";

/**
 * Idempotent: deleting an unknown or already deleted id succeeds. Detaches
 * the expenses attached to it.
 */
export const deleteTransaction = factory.createHandlers(
    validate("param", transactionIdParam),
    async (c) => {
        const userId = c.var.userId;
        const { id } = c.req.valid("param");
        await c.var.db.transaction().execute(async (trx) => {
            await trx
                .deleteFrom("transactions")
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .execute();
            // Attached expenses stay, as regular expenses.
            await trx
                .updateTable("transactions")
                .set({ main_expense_id: null, updated_at: Date.now() })
                .where("user_id", "=", userId)
                .where("main_expense_id", "=", id)
                .execute();
            await trx
                .insertInto("transaction_tombstones")
                .values({ user_id: userId, id, deleted_at: Date.now() })
                .onConflict((oc) => oc.doNothing())
                .execute();
        });
        return c.body(null, 204);
    },
);
