import type { Expense } from "@/persistence/types.ts";

export type SelectedCategoriesFilter =
    | { isActive: false; categories: [] }
    | { isActive: true; categories: string[] };

export function isMatchingCategoryFilter(
    expense: Expense,
    filter: SelectedCategoriesFilter,
): boolean {
    if (!filter.isActive || filter.categories.length === 0) {
        return true;
    }

    console.log(expense, "expense"); // TODO: Remove, just here for TS

    return false;
    // return filter.categories.includes(expense.category.color); // TODO
}
