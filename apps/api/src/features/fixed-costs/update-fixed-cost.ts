import { fixedCostPatchSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryExists,
    toColumns,
    toFixedCost,
    fixedCostIdParam,
} from "#/features/fixed-costs/fixed-costs.ts";

export const updateFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    validate("json", fixedCostPatchSchema),
    async (c) => {
        const { db, userId } = c.var;
        const patch = c.req.valid("json");
        if (
            patch.categoryId !== undefined &&
            !(await categoryExists(db, userId, patch.categoryId))
        ) {
            return c.json({ error: "unknown_category" }, 422);
        }
        const columns = Object.fromEntries(
            Object.entries(toColumns(patch)).filter(
                ([, value]) => value !== undefined,
            ),
        );
        const row =
            Object.keys(columns).length > 0
                ? await db
                      .updateTable("fixed_costs")
                      .set(columns)
                      .where("user_id", "=", userId)
                      .where("id", "=", c.req.valid("param").id)
                      .returningAll()
                      .executeTakeFirst()
                : await db
                      .selectFrom("fixed_costs")
                      .selectAll()
                      .where("user_id", "=", userId)
                      .where("id", "=", c.req.valid("param").id)
                      .executeTakeFirst();
        if (!row) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.json(toFixedCost(row));
    },
);
