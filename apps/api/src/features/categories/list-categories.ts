import { factory } from "#/http/factory.ts";
import { toCategory } from "#/features/categories/categories.ts";

/**
 * By name, the fallback categories last (expense before income).
 */
export const listCategories = factory.createHandlers(async (c) => {
    const rows = await c.var.db
        .selectFrom("categories")
        .selectAll()
        .where("user_id", "=", c.var.userId)
        .orderBy("fallback")
        .orderBy("name")
        .orderBy("kind")
        .execute();
    return c.json(rows.map(toCategory));
});
