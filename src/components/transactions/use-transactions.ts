import { useTableSubscription } from "@/hooks/use-table-subscription.ts";

import { transactionRepository } from "@/persistence/repositories/transaction-repository.ts";

export function useTransactions({
    start,
    end,
    categoryId,
}: {
    start: Date;
    end: Date;
    categoryId?: number;
}) {
    return useTableSubscription(
        () =>
            transactionRepository.getByTimeRange(
                start.getTime(),
                end.getTime(),
                categoryId,
            ),
        [start, end, categoryId],
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
            transactionRepository.getSpentAmountByTimeRange(
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
        () => transactionRepository.count(),
        [],
        "expenses:changed",
    );
}
