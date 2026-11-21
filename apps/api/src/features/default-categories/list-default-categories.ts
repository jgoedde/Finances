import { factory } from "#/http/factory.ts";
import { toDefaultCategory } from "#/features/default-categories/default-categories.ts";

/**
 * By name (expense before income for equal names).
 */
export const listDefaultCategories = factory.createHandlers(async (c) => {
    const rows = await c.var.db
        .selectFrom("default_categories")
        .selectAll()
        .orderBy("name")
        .orderBy("kind")
        .execute();
    return c.json(rows.map(toDefaultCategory));
});
