import type { MonthOverview } from "@finances/shared";
import type { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

/**
 * Cached server data unused for longer than this is dropped.
 */
const QUERY_CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Restores the query cache and the queue of pending changes from IndexedDB,
 * then keeps saving them. Resolves once restored, so the app can start
 * offline with the last known data and session.
 */
export async function restoreQueryClient(
    queryClient: QueryClient,
): Promise<void> {
    const persister = createAsyncStoragePersister({
        storage: { getItem: get, setItem: set, removeItem: del },
        key: "finances-query-cache",
        // Short, so a change captured right before closing the app is saved.
        throttleTime: 200,
    });

    const [, restored] = persistQueryClient({
        queryClient,
        persister,
        // Never expire or bust the whole cache (e.g. on app updates): it holds
        // pending changes, which are kept until they're sent or discarded.
        // Old queries are filtered individually below instead.
        maxAge: Infinity,
        dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
                query.state.status === "success" &&
                Date.now() - query.state.dataUpdatedAt < QUERY_CACHE_MAX_AGE_MS,
            // Pending transaction changes, paused or still retrying. Other
            // mutations (fixed costs) are online-only and not resumable.
            shouldDehydrateMutation: (mutation) =>
                mutation.state.status === "pending" &&
                mutation.options.mutationKey?.[0] === "transactions",
        },
    });

    try {
        await restored;
    } catch {
        // The persister already discarded the unreadable cache; start empty.
    }

    // Fixed costs cached before price changes existed (v2.8.0) have an
    // `amount` instead; refetch them.
    queryClient.removeQueries({
        queryKey: ["fixed-costs"],
        predicate: (query) => !hasPriceChanges(query.state.data),
    });
    // Fixed cost categories cached before they had a hue (v2.9.0); refetch
    // them and the overviews showing them.
    queryClient.removeQueries({
        queryKey: ["fixed-cost-categories"],
        predicate: (query) => !everyHas(query.state.data, "hue"),
    });
    queryClient.removeQueries({
        queryKey: ["insights", "overview"],
        predicate: (query) =>
            !everyHas(
                (query.state.data as MonthOverview | undefined)
                    ?.fixedCostCategories,
                "categoryHue",
            ),
    });

    // Restored mutations are not running yet. Continuing them in order lets
    // their scope run them one after another.
    for (const mutation of queryClient.getMutationCache().getAll()) {
        if (mutation.state.status === "pending") {
            void mutation.continue().catch(() => undefined);
        }
    }
}

/**
 * Whether cached fixed-cost data (a list or a single fixed cost) has
 * `priceChanges`.
 */
function hasPriceChanges(data: unknown): boolean {
    return everyHas(Array.isArray(data) ? data : [data], "priceChanges");
}

/**
 * Whether `records` is a list of objects that all have `key`.
 */
function everyHas(records: unknown, key: string): boolean {
    return (
        Array.isArray(records) &&
        records.every(
            (record) =>
                typeof record === "object" && record !== null && key in record,
        )
    );
}
