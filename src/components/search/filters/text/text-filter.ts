import type { Expense } from "@/persistence/types.ts";

export function isMatchingSearchFilter(
    expense: Expense,
    searchLower: string,
): boolean {
    const nameMatch = expense.name.toLowerCase().includes(searchLower);
    const descriptionMatch = expense.description
        ? expense.description.toLowerCase().includes(searchLower)
        : false;

    return nameMatch || descriptionMatch;
}
