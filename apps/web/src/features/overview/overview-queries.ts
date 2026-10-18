import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { MonthOverview, OverviewQuery } from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";

/**
 * The month (its first day) at a glance; `null` while loading.
 */
export function useMonthOverview(month: Date): MonthOverview | null {
    const params: OverviewQuery = {
        month: format(month, "yyyy-MM"),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
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
