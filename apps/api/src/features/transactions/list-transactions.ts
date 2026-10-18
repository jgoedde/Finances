import { transactionListQuerySchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { toTransaction } from "#/features/transactions/transactions.ts";

export const listTransactions = factory.createHandlers(
    validate("query", transactionListQuerySchema),
    async (c) => {
        const query = c.req.valid("query");
        let select = c.var.db
            .selectFrom("transactions")
            .selectAll()
            .where("user_id", "=", c.var.userId)
            .where("date", ">=", query.from)
            .where("date", "<=", query.to);
        if (query.categoryId) {
            select = select.where("category_id", "=", query.categoryId);
        }
        if (query.kind) {
            select = select.where("kind", "=", query.kind);
        }
        if (query.excludeExceptional) {
            select = select.where("exceptional", "=", 0);
        }
        const rows = await select.orderBy("date", "desc").execute();
        return c.json(rows.map(toTransaction));
    },
);
