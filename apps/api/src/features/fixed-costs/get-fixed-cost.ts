import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    fixedCostIdParam,
    loadFixedCost,
} from "#/features/fixed-costs/fixed-costs.ts";

export const getFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    async (c) => {
        const fixedCost = await loadFixedCost(
            c.var.db,
            c.var.userId,
            c.req.valid("param").id,
        );
        if (!fixedCost) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.json(fixedCost);
    },
);
