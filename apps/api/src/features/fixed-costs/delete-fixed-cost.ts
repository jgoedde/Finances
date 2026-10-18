import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { fixedCostIdParam } from "#/features/fixed-costs/fixed-costs.ts";

export const deleteFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    async (c) => {
        const result = await c.var.db
            .deleteFrom("fixed_costs")
            .where("user_id", "=", c.var.userId)
            .where("id", "=", c.req.valid("param").id)
            .executeTakeFirst();
        if (result.numDeletedRows === 0n) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.body(null, 204);
    },
);
