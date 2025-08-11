import type { Expense } from "@/persistence/types.ts";

export function isMatchingSearchFilter(
    expense: Expense,
    searchLower: string,
): boolean {
    const nameMatch = expense.name.toLowerCase().includes(searchLower);
    const descriptionMatch = expense.description
        ? expense.description.toLowerCase().includes(searchLower)
        : false;
    const categoryMatch = false; // TODO
    // const categoryMatch = expense.category.name
    //     .toLowerCase()
    //     .includes(searchLower);

    return nameMatch || descriptionMatch || categoryMatch;
}
