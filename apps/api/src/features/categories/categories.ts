import { z } from "zod";
import type {
    Category,
    FixedCostCategory,
    TransactionKind,
} from "@finances/shared";
import type { DB } from "#/db/database.ts";
import type { CategoriesTable, FixedCostCategoriesTable } from "#/db/schema.ts";

export function toCategory(row: CategoriesTable): Category {
    const base = {
        id: row.id,
        color: row.color,
        iconName: row.icon_name,
        kind: row.kind,
    };
    // The schema keeps `name` null exactly for fallback categories.
    return row.fallback === 1 || row.name === null
        ? { ...base, fallback: true, name: null }
        : { ...base, fallback: false, name: row.name };
}

export function toCategoryColumns(
    userId: string,
    category: Category,
): CategoriesTable {
    return {
        user_id: userId,
        id: category.id,
        kind: category.kind,
        fallback: category.fallback ? 1 : 0,
        name: category.name,
        color: category.color,
        icon_name: category.iconName,
    };
}

export const categoryIdParam = z.object({ id: z.string().min(1) });

export function toFixedCostCategory(
    row: FixedCostCategoriesTable,
): FixedCostCategory {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        hue: row.hue,
    };
}

/**
 * Whether another of the user's categories of `kind` is named `name`.
 */
export async function isCategoryNameTaken(
    db: DB,
    userId: string,
    kind: TransactionKind,
    name: string,
    exceptId?: string,
): Promise<boolean> {
    let query = db
        .selectFrom("categories")
        .select("id")
        .where("user_id", "=", userId)
        .where("kind", "=", kind)
        .where("name", "=", name);
    if (exceptId !== undefined) {
        query = query.where("id", "!=", exceptId);
    }
    return (await query.executeTakeFirst()) !== undefined;
}

export async function countCategoryTransactions(
    db: DB,
    userId: string,
    categoryId: string,
): Promise<number> {
    const { count } = await db
        .selectFrom("transactions")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where("user_id", "=", userId)
        .where("category_id", "=", categoryId)
        .executeTakeFirstOrThrow();
    return count;
}
