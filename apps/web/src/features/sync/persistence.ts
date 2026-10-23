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

    // Fixed costs cached before they had an amount history can't be shown;
    // drop them so they're fetched again.
    queryClient.removeQueries({
        queryKey: ["fixed-costs"],
        predicate: (query) =>
            [query.state.data]
                .flat()
                .some(
                    (it) =>
                        typeof it === "object" &&
                        it !== null &&
                        !("amounts" in it),
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
