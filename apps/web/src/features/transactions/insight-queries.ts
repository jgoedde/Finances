import { useQuery } from "@tanstack/react-query";
import type {
    CategorySpending,
    DailySpike,
    DailyTotal,
    MonthlyCategoryTotal,
    SpentQuery,
    SpentTotal,
} from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";

const EMPTY: never[] = [];

/**
 * Net spending (expenses minus income) in the range, or only expenses with
 * `onlyPositive`.
 */
export function useSpentByTimeRange({
    start,
    end,
    onlyPositive = false,
}: {
    start: Date;
    end: Date;
    onlyPositive?: boolean;
}): number {
    const params: SpentQuery = {
        from: start.getTime(),
        to: end.getTime(),
        kind: onlyPositive ? "expense" : undefined,
    };
    return (
        useQuery({
            queryKey: ["insights", "spent", params],
            queryFn: () =>
                apiFetch<SpentTotal>(
                    `/insights/spent?${toQueryString(params)}`,
                ),
        }).data?.total ?? 0
    );
}

/** Spending per category in the current month. */
export function useSpendingPerCategory(): CategorySpending[] {
    return (
        useQuery({
            queryKey: ["insights", "categories"],
            queryFn: () => apiFetch<CategorySpending[]>("/insights/categories"),
        }).data ?? EMPTY
    );
}

/** Daily spending of the last 30 days. */
export function useTrend(): DailyTotal[] {
    return (
        useQuery({
            queryKey: ["insights", "trend"],
            queryFn: () => apiFetch<DailyTotal[]>("/insights/trend"),
        }).data ?? EMPTY
    );
}

/** The most expensive day (single category) of the last 30 days. */
export function useSpike(): DailySpike | null {
    return (
        useQuery({
            queryKey: ["insights", "spike"],
            queryFn: () => apiFetch<DailySpike | null>("/insights/spike"),
        }).data ?? null
    );
}

export function useMonthlyCategoryTotals(): MonthlyCategoryTotal[] {
    return (
        useQuery({
            queryKey: ["insights", "months"],
            queryFn: () => apiFetch<MonthlyCategoryTotal[]>("/insights/months"),
        }).data ?? EMPTY
    );
}
