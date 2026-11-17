import type { Category, FixedCostCategory } from "@finances/shared";
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
