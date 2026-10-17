import type { Transaction } from "@finances/shared";

export function isMatchingSearchFilter(
    transaction: Transaction,
    searchLower: string,
): boolean {
    const nameMatch = transaction.name.toLowerCase().includes(searchLower);
    const descriptionMatch = transaction.description
        ? transaction.description.toLowerCase().includes(searchLower)
        : false;

    return nameMatch || descriptionMatch;
}
