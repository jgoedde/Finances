import { fixedCostPatchSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    arePriceChangesInRange,
    categoryExists,
    fixedCostIdParam,
    readFixedCost,
    toColumns,
    writePriceChanges,
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
        const result = await db.transaction().execute(async (trx) => {
            const existing = await readFixedCost(trx, userId, id);
            if (!existing) {
                return "not_found";
            }
            // Also catches moving the start or end date past a price change.
            if (!arePriceChangesInRange({ ...existing, ...patch })) {
                return "price_change_out_of_range";
            }
            if (Object.keys(columns).length > 0) {
                await trx
                    .updateTable("fixed_costs")
                    .set(columns)
                    .where("user_id", "=", userId)
                    .where("id", "=", id)
                    .execute();
            }
            if (patch.priceChanges !== undefined) {
                await writePriceChanges(trx, userId, id, patch.priceChanges);
            }
            return (await readFixedCost(trx, userId, id)) ?? "not_found";
        });
        if (result === "not_found") {
            return c.json({ error: result }, 404);
        }
        if (result === "price_change_out_of_range") {
            return c.json({ error: result }, 422);
        }
        return c.json(result);
    },
);
