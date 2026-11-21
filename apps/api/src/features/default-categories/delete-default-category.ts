import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { categoryIdParam } from "#/features/categories/categories.ts";

/**
 * No transaction references a default category, so nothing moves; users'
 * copies stay.
 */
export const deleteDefaultCategory = factory.createHandlers(
    validate("param", categoryIdParam),
    async (c) => {
        const { id } = c.req.valid("param");
        const result = await c.var.db
            .deleteFrom("default_categories")
            .where("id", "=", id)
            .executeTakeFirst();
        if (result.numDeletedRows === 0n) {
            return c.json({ error: "not_found" }, 404);
        }
        return c.body(null, 204);
    },
);
