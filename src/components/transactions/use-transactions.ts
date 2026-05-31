import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { transactionsRepository } from "@/persistence/repository.ts";

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
            transactionsRepository.getByTimeRange(
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
