import {
    findFixedCostSuggestion,
    fixedCostSuggestionQuerySchema,
    SUGGESTION_LOOKBACK_MONTHS,
} from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";

/**
 * More than the lookback in any month lengths and time zone.
 */
const LOOKBACK_MS = (SUGGESTION_LOOKBACK_MONTHS * 31 + 2) * 24 * 60 * 60 * 1000;

export const getFixedCostSuggestion = factory.createHandlers(
    validate("query", fixedCostSuggestionQuerySchema),
    async (c) => {
        const { db, userId } = c.var;
        const { timeZone, ...expense } = c.req.valid("query");

        const [transactions, fixedCosts] = await Promise.all([
            db
                .selectFrom("transactions")
                .select([
                    "id",
                    "date",
                    "counterparty",
                    "amount",
                    "kind",
                    "exceptional",
                ])
                .where("user_id", "=", userId)
                .where("date", ">=", expense.date - LOOKBACK_MS)
                .execute(),
            db
                .selectFrom("fixed_costs")
                .select(["name", "active"])
                .where("user_id", "=", userId)
                .execute(),
        ]);

        return c.json(
            findFixedCostSuggestion({
                expense,
                transactions: transactions.map((it) => ({
                    ...it,
                    exceptional: it.exceptional === 1,
                })),
                fixedCosts: fixedCosts.map((it) => ({
                    name: it.name,
                    active: it.active === 1,
                })),
                timeZone,
            }),
        );
    },
);
