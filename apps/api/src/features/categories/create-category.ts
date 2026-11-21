import { nanoid } from "nanoid";
import { categoryInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    isCategoryNameTaken,
    toCategory,
} from "#/features/categories/categories.ts";
import { apiError } from "#/http/api-error.ts";

export const createCategory = factory.createHandlers(
    validate("json", categoryInputSchema),
    async (c) => {
        const { db, userId } = c.var;
        const input = c.req.valid("json");
        return db.transaction().execute(async (trx) => {
            if (
                await isCategoryNameTaken(trx, userId, input.kind, input.name)
            ) {
                return apiError(c, "category_name_taken", 409);
            }
            const row = await trx
                .insertInto("categories")
                .values({
                    user_id: userId,
                    id: nanoid(8),
                    kind: input.kind,
                    fallback: 0,
                    name: input.name,
                    color: input.color,
                    icon_name: input.iconName,
                })
                .returningAll()
                .executeTakeFirstOrThrow();
            return c.json(toCategory(row), 201);
        });
    },
);
