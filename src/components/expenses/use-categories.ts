import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import {
    categoriesRepository,
    expensesRepository,
} from "@/persistence/repository.ts";
import type { Category } from "@/persistence/types.ts";

export function useCategories(): Category[] {
    return useTableSubscription(
        () => categoriesRepository.getAll(),
        [],
        "categories:changed",
    );
}

export function useSpentAmountInCategory({
    timeRange,
    categoryId,
    onlyPositive = false,
}: {
    timeRange: { start: Date; end: Date };
    categoryId: number;
    onlyPositive?: boolean;
}) {
    return useTableSubscription(
        () =>
            expensesRepository.getSpentAmountByTimeRange(
                timeRange.start.getTime(),
                timeRange.end.getTime(),
                categoryId,
                onlyPositive,
            ),
        [timeRange, categoryId, onlyPositive],
        "expenses:changed",
    );
}
