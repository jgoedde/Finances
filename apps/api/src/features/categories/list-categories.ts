import type { Category } from "@finances/shared";
import { factory } from "#/http/factory.ts";

export const listCategories = factory.createHandlers(async (c) => {
    const rows = await c.var.db
        .selectFrom("categories")
        .selectAll()
        .where("user_id", "=", c.var.userId)
        .orderBy("name")
        .execute();
    return c.json(
        rows.map((row): Category => ({
            id: row.id,
            name: row.name,
            color: row.color,
            iconName: row.icon_name,
        })),
    );
});
