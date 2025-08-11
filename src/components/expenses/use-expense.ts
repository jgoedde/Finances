import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import type { Expense, ExpenseWithCategory } from "@/persistence/types.ts";

export function useExpense<
    T extends { includeCategory: boolean } | undefined = undefined,
>(
    id: string,
    options?: T,
): T extends { includeCategory: true }
    ? ExpenseWithCategory | undefined
    : Expense | undefined {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expense without encryption key");
    }

    return useTableSubscription(
        () =>
            options?.includeCategory
                ? expensesRepository.findByIdWithCategory(id, key)
                : expensesRepository.findById(id, key),
        [options?.includeCategory, id, key],
        "expenses:changed",
    ) as never;
}
