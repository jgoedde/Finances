import { nanoid } from "nanoid";
import { fixedCostInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    arePriceChangesInRange,
    categoryExists,
    readFixedCost,
    toColumns,
    writePriceChanges,
} from "#/features/fixed-costs/fixed-costs.ts";

export const createFixedCost = factory.createHandlers(
    validate("json", fixedCostInputSchema),
    async (c) => {
        const { db, userId } = c.var;
        const input = c.req.valid("json");
        if (!(await categoryExists(db, userId, input.categoryId))) {
            return c.json({ error: "unknown_category" }, 422);
        }
        if (!arePriceChangesInRange(input)) {
            return c.json({ error: "price_change_out_of_range" }, 422);
        }
        const id = nanoid(8);
        const fixedCost = await db.transaction().execute(async (trx) => {
            await trx
                .insertInto("fixed_costs")
                .values({ ...toColumns(input), user_id: userId, id })
                .execute();
            await writePriceChanges(trx, userId, id, input.priceChanges);
            return readFixedCost(trx, userId, id);
        });
        return c.json(fixedCost, 201);
    },
);
