import { z } from "zod";
import { updateFixedCostCategorySchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { toFixedCostCategory } from "#/features/categories/categories.ts";

export const updateFixedCostCategory = factory.createHandlers(
    validate("param", z.object({ id: z.string().min(1) })),
    validate("json", updateFixedCostCategorySchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const { hue } = c.req.valid("json");
        const row = await c.var.db
            .updateTable("fixed_cost_categories")
            .set({ hue })
            .where("user_id", "=", c.var.userId)
            .where("id", "=", id)
            .returningAll()
            .executeTakeFirst();
        if (!row) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.json(toFixedCostCategory(row));
    },
);
