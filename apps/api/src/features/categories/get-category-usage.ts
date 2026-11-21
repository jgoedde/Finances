import type { CategoryUsage } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryIdParam,
    countCategoryTransactions,
} from "#/features/categories/categories.ts";
import { apiError } from "#/http/api-error.ts";

/**
 * How many transactions deleting the category would move.
 */
export const getCategoryUsage = factory.createHandlers(
    validate("param", categoryIdParam),
    async (c) => {
        const { db, userId } = c.var;
        const { id } = c.req.valid("param");
        const category = await db
            .selectFrom("categories")
            .select("id")
            .where("user_id", "=", userId)
            .where("id", "=", id)
            .executeTakeFirst();
        if (!category) {
            return apiError(c, "not_found", 404);
        }
        const usage: CategoryUsage = {
            transactions: await countCategoryTransactions(db, userId, id),
        };
        return c.json(usage);
    },
);
