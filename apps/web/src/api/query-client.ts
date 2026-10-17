import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError, isUnauthorized } from "@/api/api-client.ts";
import { QUERY_CACHE_MAX_AGE_MS } from "@/features/sync/persistence.ts";

function isClientError(error: unknown): boolean {
    return error instanceof ApiError && error.status < 500;
}

/**
 * @param onUnauthorized called when any request finds the session gone
 */
export function createQueryClient(onUnauthorized: () => void) {
    const handleError = (error: unknown) => {
        if (isUnauthorized(error)) {
            onUnauthorized();
        }
    };

    return new QueryClient({
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({ onError: handleError }),
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
                // Keep data for offline use; persistence drops it after this.
                gcTime: QUERY_CACHE_MAX_AGE_MS,
                // Client errors (401, 404, validation) won't fix themselves.
                retry: (failureCount, error) =>
                    !isClientError(error) && failureCount < 2,
            },
        },
    });
}
