import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import type { Expense } from "@/persistence/types.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useExpense(id: string): Expense | undefined {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expense without encryption key");
    }

    return useTableSubscription(
        () => expensesRepository.findById(id, key),
        [id, key],
        "expenses:changed",
    );
}
