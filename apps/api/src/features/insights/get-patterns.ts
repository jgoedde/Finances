import {
    findPatterns,
    firstPatternMonth,
    monthInsightQuerySchema,
    toIsoDate,
} from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { loadWindow } from "#/features/insights/insights.ts";
import { toTransaction } from "#/features/transactions/transactions.ts";

export const getPatterns = factory.createHandlers(
    validate("query", monthInsightQuerySchema),
    async (c) => {
        const { db, userId } = c.var;
        const { month, timeZone } = c.req.valid("query");
        const { from, to } = loadWindow(firstPatternMonth(month), month);

        const [transactions, categories] = await Promise.all([
            db
                .selectFrom("transactions")
                .selectAll()
                .where("user_id", "=", userId)
                .where("date", ">=", from)
                .where("date", "<", to)
                .execute(),
            db
                .selectFrom("categories")
                .select(["id", "name", "color"])
                .where("user_id", "=", userId)
                .execute(),
        ]);

        return c.json(
            findPatterns({
                month,
                timeZone,
                today: toIsoDate(Date.now(), timeZone),
                transactions: transactions.map(toTransaction),
                categories,
            }),
        );
    },
);
