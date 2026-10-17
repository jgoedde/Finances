import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError, isUnauthorized } from "#/api/api-client.ts";

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
                // Keep data for offline use; persistence drops queries
                // unused for 30 days (persistence.ts). Not a finite gcTime: GC
                // runs on setTimeout, and delays above 2^31-1 ms (~24.8 days)
                // overflow and fire immediately, evicting every query that
                // has no observer (e.g. while a component suspends).
                gcTime: Infinity,
                // Client errors (401, 404, validation) won't fix themselves.
                retry: (failureCount, error) =>
                    !isClientError(error) && failureCount < 2,
            },
        },
    });
}
