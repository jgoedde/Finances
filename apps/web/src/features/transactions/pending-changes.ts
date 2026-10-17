import type { QueryClient } from "@tanstack/react-query";
import type { Transaction, TransactionListQuery } from "@finances/shared";

/** A transaction change not yet accepted by the server. */
export interface PendingChange {
    action: "save" | "delete";
    transaction: Transaction;
}

export const TRANSACTION_MUTATION_KEY = ["transactions"] as const;

/** The queued changes, oldest first. */
export function getPendingChanges(queryClient: QueryClient): PendingChange[] {
    return queryClient
        .getMutationCache()
        .findAll({ mutationKey: TRANSACTION_MUTATION_KEY, status: "pending" })
        .map((mutation) => ({
            action: mutation.options
                .mutationKey?.[1] as PendingChange["action"],
            transaction: mutation.state.variables as Transaction,
        }));
}

function belongsTo(params: TransactionListQuery, t: Transaction): boolean {
    return (
        t.date >= params.from &&
        t.date <= params.to &&
        (params.categoryId === undefined ||
            t.categoryId === params.categoryId) &&
        (params.kind === undefined || t.kind === params.kind) &&
        (!params.excludeExceptional || !t.exceptional)
    );
}

/** Applies changes to a list as the server will once it has them. */
export function applyToList(
    list: Transaction[],
    params: TransactionListQuery,
    changes: PendingChange[],
): Transaction[] {
    let result = list;
    for (const { action, transaction } of changes) {
        result = result.filter((t) => t.id !== transaction.id);
        if (action === "save" && belongsTo(params, transaction)) {
            result = [...result, transaction].sort((a, b) => b.date - a.date);
        }
    }
    return result;
}

/** Applies a change to every cached transaction list and detail. */
export function applyToCache(
    queryClient: QueryClient,
    change: PendingChange,
): void {
    for (const [queryKey] of queryClient.getQueriesData<Transaction[]>({
        queryKey: ["transactions", "list"],
    })) {
        const params = queryKey[2] as TransactionListQuery;
        queryClient.setQueryData<Transaction[]>(queryKey, (list) =>
            list ? applyToList(list, params, [change]) : list,
        );
    }

    // A deleted transaction's detail is left alone: removing it could make
    // the still-open edit page refetch it right before navigating away.
    if (change.action === "save") {
        queryClient.setQueryData(
            ["transactions", "detail", change.transaction.id],
            change.transaction,
        );
    }
}

/** Any cached version of the transaction, e.g. to edit it offline. */
export function findCachedTransaction(
    queryClient: QueryClient,
    id: string,
): Transaction | undefined {
    for (const [, list] of queryClient.getQueriesData<Transaction[]>({
        queryKey: ["transactions", "list"],
    })) {
        const found = list?.find((t) => t.id === id);
        if (found) {
            return found;
        }
    }
    return undefined;
}
