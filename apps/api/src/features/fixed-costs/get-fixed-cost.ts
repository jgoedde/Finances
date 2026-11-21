import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    fixedCostIdParam,
    readFixedCost,
} from "#/features/fixed-costs/fixed-costs.ts";
import { apiError } from "#/http/api-error.ts";

export const getFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    async (c) => {
        const fixedCost = await readFixedCost(
            c.var.db,
            c.var.userId,
            c.req.valid("param").id,
        );
        if (!fixedCost) {
            return apiError(c, "not_found", 404);
        }
        return c.json(fixedCost);
    },
);
