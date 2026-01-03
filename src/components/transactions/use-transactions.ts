import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { transactionsRepository } from "@/persistence/repository.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useTransactions({
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
            transactionsRepository.getByTimeRange(
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
            transactionsRepository.getSpentAmountByTimeRange(
                start.getTime(),
                end.getTime(),
                undefined,
                onlyPositive,
            ),
        [start, end],
        "expenses:changed",
    );
}

export function useTransactionCount() {
    return useTableSubscription(
        () => transactionsRepository.count(),
        [],
        "expenses:changed",
    );
}
