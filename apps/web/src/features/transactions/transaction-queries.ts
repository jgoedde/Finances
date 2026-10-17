import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type {
    Category,
    Transaction,
    TransactionInput,
    TransactionListQuery,
} from "@finances/shared";
import { apiFetch, toQueryString } from "@/api/api-client.ts";

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
        queryFn: () =>
            apiFetch<Transaction[]>(`/transactions?${toQueryString(params)}`),
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
        queryFn: () => apiFetch<Transaction>(`/transactions/${id}`),
    });
}

/** Creates or replaces a transaction (idempotent). */
export function useSaveTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...input }: Transaction) =>
            apiFetch<Transaction | undefined>(`/transactions/${id}`, {
                method: "PUT",
                body: input satisfies TransactionInput,
            }),
        onSettled: () => invalidateTransactionData(queryClient),
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<undefined>(`/transactions/${id}`, { method: "DELETE" }),
        onSettled: () => invalidateTransactionData(queryClient),
    });
}

function invalidateTransactionData(
    queryClient: ReturnType<typeof useQueryClient>,
) {
    return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["insights"] }),
    ]);
}
