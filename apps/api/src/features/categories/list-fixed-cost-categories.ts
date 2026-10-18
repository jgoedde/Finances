import type { FixedCostCategory } from "@finances/shared";
import { factory } from "#/http/factory.ts";

export const listFixedCostCategories = factory.createHandlers(async (c) => {
    const rows = await c.var.db
        .selectFrom("fixed_cost_categories")
        .selectAll()
        .where("user_id", "=", c.var.userId)
        .orderBy("name")
        .execute();
    return c.json(
        rows.map((row): FixedCostCategory => ({
            id: row.id,
            name: row.name,
            description: row.description,
        })),
    );
});
