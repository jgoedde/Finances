import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type {
    MonthInsightQuery,
    MonthOverview,
    Pattern,
} from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";

/**
 * The month (its first day) at a glance; `null` while loading.
 */
function toQuery(month: Date): MonthInsightQuery {
    return {
        month: format(month, "yyyy-MM"),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}

export function useMonthOverview(month: Date): MonthOverview | null {
    const params = toQuery(month);
    return (
        useQuery({
            queryKey: ["insights", "overview", params],
            queryFn: () =>
                apiFetch<MonthOverview>(
                    `/insights/overview?${toQueryString(params)}`,
                ),
        }).data ?? null
    );
}

const NO_PATTERNS: Pattern[] = [];

/**
 * The patterns of the three months ending with `month`; empty while loading.
 */
export function usePatterns(month: Date): Pattern[] {
    const params = toQuery(month);
    return (
        useQuery({
            queryKey: ["insights", "patterns", params],
            queryFn: () =>
                apiFetch<Pattern[]>(
                    `/insights/patterns?${toQueryString(params)}`,
                ),
        }).data ?? NO_PATTERNS
    );
}
