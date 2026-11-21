import { deleteCategoryQuerySchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryIdParam,
    countCategoryTransactions,
} from "#/features/categories/categories.ts";
import { apiError } from "#/http/api-error.ts";

/**
 * Deletes a category, first moving its transactions to `moveTo` (a category
 * of the same kind), all in one database transaction. Only a category
 * without transactions needs no target. The fallback category stays.
 */
export const deleteCategory = factory.createHandlers(
    validate("param", categoryIdParam),
    validate("query", deleteCategoryQuerySchema),
    async (c) => {
        const { db, userId } = c.var;
        const { id } = c.req.valid("param");
        const { moveTo } = c.req.valid("query");

        return db.transaction().execute(async (trx) => {
            const category = await trx
                .selectFrom("categories")
                .select(["kind", "fallback"])
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .executeTakeFirst();
            if (!category) {
                return apiError(c, "not_found", 404);
            }
            if (category.fallback === 1) {
                return apiError(c, "fallback_category", 422);
            }

            if ((await countCategoryTransactions(trx, userId, id)) > 0) {
                if (moveTo === undefined) {
                    return apiError(c, "category_in_use", 409);
                }
                const target = await trx
                    .selectFrom("categories")
                    .select("kind")
                    .where("user_id", "=", userId)
                    .where("id", "=", moveTo)
                    .where("id", "!=", id)
                    .executeTakeFirst();
                if (!target) {
                    return apiError(c, "unknown_category", 422);
                }
                if (target.kind !== category.kind) {
                    return apiError(c, "category_kind_mismatch", 422);
                }
                await trx
                    .updateTable("transactions")
                    .set({ category_id: moveTo, updated_at: Date.now() })
                    .where("user_id", "=", userId)
                    .where("category_id", "=", id)
                    .execute();
            }

            await trx
                .deleteFrom("categories")
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .execute();
            return c.body(null, 204);
        });
    },
);
