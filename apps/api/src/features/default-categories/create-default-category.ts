import { nanoid } from "nanoid";
import { categoryInputSchema } from "@finances/shared";
import { factory } from "#/http/factory.ts";
import { validate } from "#/http/validate.ts";
import {
    isDefaultCategoryNameTaken,
    toDefaultCategory,
} from "#/features/default-categories/default-categories.ts";

export const createDefaultCategory = factory.createHandlers(
    validate("json", categoryInputSchema),
    async (c) => {
        const { db } = c.var;
        const input = c.req.valid("json");
        return db.transaction().execute(async (trx) => {
            if (await isDefaultCategoryNameTaken(trx, input.kind, input.name)) {
                return c.json({ error: "category_name_taken" as const }, 409);
            }
            const row = await trx
                .insertInto("default_categories")
                .values({
                    id: nanoid(8),
                    kind: input.kind,
                    name: input.name,
                    color: input.color,
                    icon_name: input.iconName,
                })
                .returningAll()
                .executeTakeFirstOrThrow();
            return c.json(toDefaultCategory(row), 201);
        });
    },
);
