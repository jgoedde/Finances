import { fixedCostPatchSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryExists,
    fixedCostIdParam,
    loadFixedCost,
    replaceAmounts,
    toColumns,
} from "#/features/fixed-costs/fixed-costs.ts";

export const updateFixedCost = factory.createHandlers(
    validate("param", fixedCostIdParam),
    validate("json", fixedCostPatchSchema),
    async (c) => {
        const { db, userId } = c.var;
        const { id } = c.req.valid("param");
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
        const found = await db.transaction().execute(async (trx) => {
            const row = await trx
                .selectFrom("fixed_costs")
                .select("id")
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .executeTakeFirst();
            if (!row) {
                return false;
            }
            if (Object.keys(columns).length > 0) {
                await trx
                    .updateTable("fixed_costs")
                    .set(columns)
                    .where("user_id", "=", userId)
                    .where("id", "=", id)
                    .execute();
            }
            if (patch.amounts !== undefined) {
                await replaceAmounts(trx, userId, id, patch.amounts);
            }
            return true;
        });
        if (!found) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.json((await loadFixedCost(db, userId, id))!);
    },
);
