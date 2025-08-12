import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useMasterPasswordCheck(): (key?: string) => boolean {
    return (key) => {
        if (!key) {
            return false;
        }
        return expensesRepository.checkMasterPassword(key);
    };
}

export function useExpenses({
    start,
    end,
    categoryId,
}: {
    start: Date;
    end: Date;
    categoryId?: number;
}) {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expenses without encryption key");
    }

    return useTableSubscription(
        () =>
            expensesRepository.getByTimeRange(
                start.getTime(),
                end.getTime(),
                key,
                categoryId,
            ),
        [key, start, end, categoryId],
        "expenses:changed",
    );
}

export function useSpentByTimeRange({
    start,
    end,
    onlyPositive = false,
}: {
    start: Date;
    end: Date;
    onlyPositive?: boolean;
}) {
    return useTableSubscription(
        () =>
            expensesRepository.getSpentAmountByTimeRange(
                start.getTime(),
                end.getTime(),
                undefined,
                onlyPositive,
            ),
        [start, end],
        "expenses:changed",
    );
}

export function useExpensesCount() {
    return useTableSubscription(
        () => expensesRepository.count(),
        [],
        "expenses:changed",
    );
}
