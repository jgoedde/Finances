import { nanoid } from "nanoid";
import { fixedCostInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryExists,
    loadFixedCost,
    replaceAmounts,
    toColumns,
} from "#/features/fixed-costs/fixed-costs.ts";

export const createFixedCost = factory.createHandlers(
    validate("json", fixedCostInputSchema),
    async (c) => {
        const { db, userId } = c.var;
        const input = c.req.valid("json");
        if (!(await categoryExists(db, userId, input.categoryId))) {
            return c.json({ error: "unknown_category" }, 422);
        }
        const id = nanoid(8);
        await db.transaction().execute(async (trx) => {
            await trx
                .insertInto("fixed_costs")
                .values({ ...toColumns(input), user_id: userId, id })
                .execute();
            await replaceAmounts(trx, userId, id, input.amounts);
        });
        return c.json((await loadFixedCost(db, userId, id))!, 201);
    },
);
