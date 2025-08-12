import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useExpenses() {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query expenses without encryption key");
    }

    return useTableSubscription(
        () => expensesRepository.getAll(key),
        [key],
        "expenses:changed",
    );
}

export function useMasterPasswordCheck(): (key?: string) => boolean {
    return (key) => {
        if (!key) {
            return false;
        }
        return expensesRepository.checkMasterPassword(key);
    };
}

export function useExpensesByTimeRange({
    start,
    end,
}: {
    start: Date;
    end: Date;
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
            ),
        [key, start, end],
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
