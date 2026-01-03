import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { transactionsRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";
import type {
    Transaction,
    TransactionWithCategory,
} from "@/persistence/types.ts";

export function useTransaction<
    T extends { includeCategory: boolean } | undefined = undefined,
>(
    id: string,
    options?: T,
): T extends { includeCategory: true }
    ? TransactionWithCategory | undefined
    : Transaction | undefined {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expense without encryption key");
    }

    return useTableSubscription(
        () =>
            options?.includeCategory
                ? transactionsRepository.findByIdWithCategory(id, key)
                : transactionsRepository.findById(id, key),
        [options?.includeCategory, id, key],
        "expenses:changed",
    ) as never;
}
