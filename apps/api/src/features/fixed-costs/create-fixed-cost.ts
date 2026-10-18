import { nanoid } from "nanoid";
import { fixedCostInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryExists,
    toColumns,
    toFixedCost,
} from "#/features/fixed-costs/fixed-costs.ts";

export const createFixedCost = factory.createHandlers(
    validate("json", fixedCostInputSchema),
    async (c) => {
        const userId = c.var.userId;
        const input = c.req.valid("json");
        if (!(await categoryExists(c.var.db, userId, input.categoryId))) {
            return c.json({ error: "unknown_category" }, 422);
        }
        const row = await c.var.db
            .insertInto("fixed_costs")
            .values({ ...toColumns(input), user_id: userId, id: nanoid(8) })
            .returningAll()
            .executeTakeFirstOrThrow();
        return c.json(toFixedCost(row), 201);
    },
);
