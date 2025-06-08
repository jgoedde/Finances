import type { Expense } from "@/components/expense.ts";

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

    return filter.categories.includes(expense.category.color);
}
