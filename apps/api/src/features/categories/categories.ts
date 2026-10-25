import type { FixedCostCategory } from "@finances/shared";
import type { FixedCostCategoriesTable } from "#/db/schema.ts";

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
