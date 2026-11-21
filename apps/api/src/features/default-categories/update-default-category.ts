import { categoryPatchSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import { categoryIdParam } from "#/features/categories/categories.ts";
import {
    isDefaultCategoryNameTaken,
    toDefaultCategory,
} from "#/features/default-categories/default-categories.ts";
import { apiError } from "#/http/api-error.ts";

/**
 * Renames, recolors or re-icons a default category. The kind is fixed, and
 * users' copies stay as they are.
 */
export const updateDefaultCategory = factory.createHandlers(
    validate("param", categoryIdParam),
    validate("json", categoryPatchSchema),
    async (c) => {
        const { db } = c.var;
        const { id } = c.req.valid("param");
        const patch = c.req.valid("json");

        return db.transaction().execute(async (trx) => {
            const category = await trx
                .selectFrom("default_categories")
                .select("kind")
                .where("id", "=", id)
                .executeTakeFirst();
            if (!category) {
                return apiError(c, "not_found", 404);
            }
            if (
                patch.name !== undefined &&
                (await isDefaultCategoryNameTaken(
                    trx,
                    category.kind,
                    patch.name,
                    id,
                ))
            ) {
                return apiError(c, "category_name_taken", 409);
            }
            const row = await trx
                .updateTable("default_categories")
                .set({
                    name: patch.name,
                    color: patch.color,
                    icon_name: patch.iconName,
                })
                .where("id", "=", id)
                .returningAll()
                .executeTakeFirstOrThrow();
            return c.json(toDefaultCategory(row));
        });
    },
);
