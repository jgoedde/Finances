import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { Transaction, TransactionInput } from "@finances/shared";
import { ApiError, apiFetch, isUnauthorized } from "#/api/api-client.ts";
import { apiErrorCode } from "#/api/api-errors.ts";
import { sessionQuery } from "#/auth/auth-client.ts";
import { syncFailures } from "#/features/sync/sync-failures.ts";
import {
    applyToCache,
    type PendingChange,
    TRANSACTION_MUTATION_KEY,
} from "#/features/transactions/pending-changes.ts";

// Transaction changes are queued mutations: they work offline, survive
// reloads (see features/sync/persistence.ts) and run one after another. Their
// logic lives in mutation defaults, not in components, so restored mutations
// can still run after a reload.

const SAVE_KEY = [...TRANSACTION_MUTATION_KEY, "save"] as const;
const DELETE_KEY = [...TRANSACTION_MUTATION_KEY, "delete"] as const;

interface MutationMeta extends Record<string, unknown> {
    /** The user who made the change. */
    userId: string;
}

/** The change belongs to a user who is no longer signed in on this device. */
class ForeignChangeError extends Error {}

/**
 * Keep retrying everything the server may still accept later: network
 * errors, server errors and 401 (until the user signs in again). Other client
 * errors won't change on retry and become sync failures.
 */
function shouldRetry(_failureCount: number, error: unknown): boolean {
    if (error instanceof ForeignChangeError) {
        return false;
    }
    if (!(error instanceof ApiError)) {
        return true;
    }
    return [401, 408, 429].includes(error.status) || error.status >= 500;
}

function retryDelay(attempt: number): number {
    return Math.min(1000 * 2 ** attempt, 30 * 1000);
}

export function registerTransactionMutations(
    queryClient: QueryClient,
    { onUnauthorized }: { onUnauthorized: () => void },
) {
    async function run<T>(
        meta: unknown,
        request: () => Promise<T>,
    ): Promise<T> {
        // Another user signed in since: never send their change with this
        // session. (Signed out entirely: keep retrying until someone signs in.)
        const currentUser = queryClient.getQueryData(sessionQuery.queryKey);
        const owner = (meta as MutationMeta | undefined)?.userId;
        if (currentUser && owner && currentUser.id !== owner) {
            throw new ForeignChangeError();
        }
        try {
            return await request();
        } catch (error) {
            if (isUnauthorized(error)) {
                onUnauthorized();
            }
            throw error;
        }
    }

    function onError(action: PendingChange["action"]) {
        return (error: unknown, transaction: Transaction) => {
            if (!(error instanceof ForeignChangeError)) {
                syncFailures.add({
                    action,
                    transaction,
                    // Worded when shown, in the language at that time.
                    error:
                        error instanceof ApiError
                            ? {
                                  status: error.status,
                                  code: apiErrorCode(error),
                              }
                            : undefined,
                });
            }
            // Drop the optimistic state.
            void refreshWhenIdle();
        };
    }

    /** Refetch only once the queue is empty, so later changes don't flicker. */
    async function refreshWhenIdle() {
        if (
            queryClient.isMutating({ mutationKey: TRANSACTION_MUTATION_KEY }) >
            1
        ) {
            return;
        }
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["transactions"] }),
            queryClient.invalidateQueries({ queryKey: ["insights"] }),
        ]);
    }

    const shared = {
        retry: shouldRetry,
        retryDelay,
        scope: { id: "transactions" },
        onSettled: refreshWhenIdle,
    };

    queryClient.setMutationDefaults<unknown, Error, Transaction>(SAVE_KEY, {
        ...shared,
        mutationFn: ({ id, ...input }, { meta }) =>
            run(meta, () =>
                apiFetch(`/transactions/${id}`, {
                    method: "PUT",
                    body: input satisfies TransactionInput,
                }),
            ),
        onMutate: (transaction) =>
            applyToCache(queryClient, { action: "save", transaction }),
        onError: onError("save"),
    });

    queryClient.setMutationDefaults<unknown, Error, Transaction>(DELETE_KEY, {
        ...shared,
        mutationFn: ({ id }, { meta }) =>
            run(meta, () =>
                apiFetch(`/transactions/${id}`, { method: "DELETE" }),
            ),
        onMutate: (transaction) =>
            applyToCache(queryClient, { action: "delete", transaction }),
        onError: onError("delete"),
    });
}

function useChangeMutation(mutationKey: readonly string[]) {
    const userId = useQuery(sessionQuery).data?.id ?? "";
    return useMutation<unknown, Error, Transaction>({
        mutationKey,
        meta: { userId } satisfies MutationMeta,
    });
}

/** Creates or replaces a transaction; works offline. */
export function useSaveTransaction() {
    return useChangeMutation(SAVE_KEY);
}

/** Deletes a transaction (pass the whole transaction, for display); works offline. */
export function useDeleteTransaction() {
    return useChangeMutation(DELETE_KEY);
}
