import { categoryPatchSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    categoryIdParam,
    isCategoryNameTaken,
    toCategory,
} from "#/features/categories/categories.ts";
import { apiError } from "#/http/api-error.ts";

/**
 * Renames, recolors or re-icons a category. The kind is fixed, and the
 * fallback category keeps its (absent) name.
 */
export const updateCategory = factory.createHandlers(
    validate("param", categoryIdParam),
    validate("json", categoryPatchSchema),
    async (c) => {
        const { db, userId } = c.var;
        const { id } = c.req.valid("param");
        const patch = c.req.valid("json");

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
            if (patch.name !== undefined) {
                if (category.fallback === 1) {
                    return apiError(c, "fallback_category", 422);
                }
                if (
                    await isCategoryNameTaken(
                        trx,
                        userId,
                        category.kind,
                        patch.name,
                        id,
                    )
                ) {
                    return apiError(c, "category_name_taken", 409);
                }
            }
            const row = await trx
                .updateTable("categories")
                .set({
                    name: patch.name,
                    color: patch.color,
                    icon_name: patch.iconName,
                })
                .where("user_id", "=", userId)
                .where("id", "=", id)
                .returningAll()
                .executeTakeFirstOrThrow();
            return c.json(toCategory(row));
        });
    },
);
