import { factory } from "#/http/factory.ts";
import { toFixedCost } from "#/features/fixed-costs/fixed-costs.ts";

export const listFixedCosts = factory.createHandlers(async (c) => {
    const rows = await c.var.db
        .selectFrom("fixed_costs")
        .selectAll()
        .where("user_id", "=", c.var.userId)
        .orderBy("name")
        .execute();
    return c.json(rows.map(toFixedCost));
});
