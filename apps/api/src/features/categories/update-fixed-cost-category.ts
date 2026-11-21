import { updateFixedCostCategorySchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryIdParam,
    toFixedCostCategory,
} from "#/features/categories/categories.ts";
import { apiError } from "#/http/api-error.ts";

export const updateFixedCostCategory = factory.createHandlers(
    validate("param", categoryIdParam),
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
            return apiError(c, "not_found", 404);
        }
        return c.json(toFixedCostCategory(row));
    },
);
