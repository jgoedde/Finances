import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
    Category,
    Transaction,
    TransactionListQuery,
} from "@finances/shared";
import { apiFetch, toQueryString } from "@/api/api-client.ts";
import {
    applyToList,
    getPendingChanges,
} from "@/features/transactions/pending-changes.ts";

const EMPTY: never[] = [];

export const categoriesQuery = queryOptions({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/categories"),
    staleTime: Infinity,
});

export function useCategories(): Category[] {
    return useQuery(categoriesQuery).data ?? EMPTY;
}

export function transactionsQuery(params: TransactionListQuery) {
    return queryOptions({
        queryKey: ["transactions", "list", params],
        // Pending changes are merged in, so a refetch never hides them.
        queryFn: async ({ client }) =>
            applyToList(
                await apiFetch<Transaction[]>(
                    `/transactions?${toQueryString(params)}`,
                ),
                params,
                getPendingChanges(client),
            ),
    });
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
            const pending = getPendingChanges(client)
                .reverse()
                .find((change) => change.transaction.id === id);
            if (pending?.action === "save") {
                return pending.transaction;
            }
            return apiFetch<Transaction>(`/transactions/${id}`);
        },
    });
}
