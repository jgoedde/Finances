import type { DefaultCategory, TransactionKind } from "@finances/shared";
import type { DB } from "#/db/database.ts";
import type { DefaultCategoriesTable } from "#/db/schema.ts";

export function toDefaultCategory(
    row: DefaultCategoriesTable,
): DefaultCategory {
    return {
        id: row.id,
        kind: row.kind,
        name: row.name,
        color: row.color,
        iconName: row.icon_name,
    };
}

/**
 * Whether another default category of `kind` is named `name`.
 */
export async function isDefaultCategoryNameTaken(
    db: DB,
    kind: TransactionKind,
    name: string,
    exceptId?: string,
): Promise<boolean> {
    let query = db
        .selectFrom("default_categories")
        .select("id")
        .where("kind", "=", kind)
        .where("name", "=", name);
    if (exceptId !== undefined) {
        query = query.where("id", "!=", exceptId);
    }
    return (await query.executeTakeFirst()) !== undefined;
}
