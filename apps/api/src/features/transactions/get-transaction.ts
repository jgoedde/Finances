import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    toTransaction,
    transactionIdParam,
} from "#/features/transactions/transactions.ts";
import { apiError } from "#/http/api-error.ts";

export const getTransaction = factory.createHandlers(
    validate("param", transactionIdParam),
    async (c) => {
        const row = await c.var.db
            .selectFrom("transactions")
            .selectAll()
            .where("user_id", "=", c.var.userId)
            .where("id", "=", c.req.valid("param").id)
            .executeTakeFirst();
        if (!row) {
            return apiError(c, "not_found", 404);
        }
        return c.json(toTransaction(row));
    },
);
