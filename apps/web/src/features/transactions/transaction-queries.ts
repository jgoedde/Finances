import {
    onlineManager,
    type QueryClient,
    queryOptions,
    useQuery,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import type { Transaction, TransactionListQuery } from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";
import {
    applyToList,
    resolvePendingChanges,
} from "#/features/transactions/pending-changes.ts";

const EMPTY: never[] = [];

export function transactionsQuery(params: TransactionListQuery) {
    return queryOptions({
        queryKey: ["transactions", "list", params],
        // Pending changes are merged in, so a refetch never hides them.
        queryFn: async ({ client }) => {
            const list = await apiFetch<Transaction[]>(
                `/transactions?${toQueryString(params)}`,
            );
            return applyToList(
                list,
                params,
                resolvePendingChanges(client, list),
            );
        },
    });
}

/**
 * The whole month containing `date`, as the list shows it. Attached expenses
 * are always on their main expense's day, so it holds all of a transaction's
 * attached expenses and the expenses it can be attached to.
 */
export function monthTransactionsQuery(date: number | Date) {
    return transactionsQuery({
        from: startOfMonth(date).getTime(),
        to: endOfMonth(date).getTime(),
    });
}

/**
 * Loads the month containing `date` unless it is cached. Offline, or if
 * loading fails, it doesn't wait: whatever is cached has to do.
 */
export async function ensureMonthTransactions(
    queryClient: QueryClient,
    date: number,
): Promise<void> {
    if (onlineManager.isOnline()) {
        await queryClient
            .query({ ...monthTransactionsQuery(date), staleTime: "static" })
            .catch(() => undefined);
    }
}

export function useTransactions({
    start,
    end,
    categoryId,
}: {
    start: Date;
    end: Date;
    categoryId?: string;
}): Transaction[] {
    return (
        useQuery(
            transactionsQuery({
                from: start.getTime(),
                to: end.getTime(),
                categoryId,
            }),
        ).data ?? EMPTY
    );
}

export function transactionQuery(id: string) {
    return queryOptions({
        queryKey: ["transactions", "detail", id],
        queryFn: async ({ client }) => {
            const pending = resolvePendingChanges(client)
                .reverse()
                .find((change) => change.transaction.id === id);
            if (pending?.action === "save") {
                return pending.transaction;
            }
            return apiFetch<Transaction>(`/transactions/${id}`);
        },
    });
}
