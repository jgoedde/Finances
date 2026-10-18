import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    toFixedCost,
    fixedCostIdParam,
} from "#/features/fixed-costs/fixed-costs.ts";

export const getFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    async (c) => {
        const row = await c.var.db
            .selectFrom("fixed_costs")
            .selectAll()
            .where("user_id", "=", c.var.userId)
            .where("id", "=", c.req.valid("param").id)
            .executeTakeFirst();
        if (!row) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.json(toFixedCost(row));
    },
);
