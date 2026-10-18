import { monthInsightQuerySchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { toFixedCost } from "#/features/fixed-costs/fixed-costs.ts";
import { toTransaction } from "#/features/transactions/transactions.ts";
import {
    buildMonthOverview,
    overviewWindow,
} from "#/features/insights/month-overview.ts";

export const getMonthOverview = factory.createHandlers(
    validate("query", monthInsightQuerySchema),
    async (c) => {
        const { db, userId } = c.var;
        const { month, timeZone } = c.req.valid("query");
        const { from, to } = overviewWindow(month);

        const [transactions, categories, fixedCosts] = await Promise.all([
            db
                .selectFrom("transactions")
                .selectAll()
                .where("user_id", "=", userId)
                .where("date", ">=", from)
                .where("date", "<", to)
                .execute(),
            db
                .selectFrom("categories")
                .select(["id", "name", "color", "icon_name"])
                .where("user_id", "=", userId)
                .execute(),
            db
                .selectFrom("fixed_costs")
                .selectAll()
                .where("user_id", "=", userId)
                .execute(),
        ]);

        return c.json(
            buildMonthOverview({
                month,
                timeZone,
                now: Date.now(),
                transactions: transactions.map(toTransaction),
                categories,
                fixedCosts: fixedCosts.map(toFixedCost),
            }),
        );
    },
);
