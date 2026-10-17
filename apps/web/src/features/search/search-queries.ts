import {
    infiniteQueryOptions,
    keepPreviousData,
    useInfiniteQuery,
} from "@tanstack/react-query";
import type {
    TransactionSearchPage,
    TransactionSearchQuery,
} from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";
import {
    type DateFilterOption,
    getOlderThan,
} from "#/features/search/filters/date/date-filter.ts";

interface SearchParams {
    q: string;
    older: DateFilterOption;
}

// Keyed by the filter option, not the timestamp, so the key stays stable.
// Under "transactions" so transaction mutations invalidate it, but outside
// "list", which holds plain arrays.
function transactionSearchQuery(params: SearchParams) {
    return infiniteQueryOptions({
        queryKey: ["transactions", "search", params],
        queryFn: ({ pageParam }) =>
            apiFetch<TransactionSearchPage>(
                `/transactions/search?${toQueryString<TransactionSearchQuery>({
                    q: params.q || undefined,
                    olderThan: getOlderThan(params.older),
                    cursor: pageParam,
                })}`,
            ),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
}

/**
 * Pages of search results, newest first. Offline it only shows pages that
 * were already loaded (restored from the persisted cache).
 */
export function useTransactionSearch(params: SearchParams) {
    return useInfiniteQuery({
        ...transactionSearchQuery(params),
        // Keep showing the old results while the next term loads.
        placeholderData: keepPreviousData,
    });
}
