import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import type { Expense } from "@/persistence/types.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useExpensesByCategory(categoryId: number): Expense[] {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expenses without encryption key");
    }

    return useTableSubscription(
        () => expensesRepository.getByCategoryId(categoryId, key),
        [categoryId, key],
        "expenses:changed",
    );
}
