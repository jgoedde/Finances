import type { QueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import {
    canAttachTo,
    matchesListQuery,
    type Transaction,
    type TransactionListQuery,
} from "@finances/shared";
import type { TransactionFormRelation } from "#/features/transactions/components/form/transaction-form.tsx";

/**
 * A transaction change not yet accepted by the server.
 */
export interface PendingChange {
    action: "save" | "delete";
    transaction: Transaction;
}

export const TRANSACTION_MUTATION_KEY = ["transactions"] as const;

/**
 * The queued changes, oldest first. Saves queued by older versions, whose
 * transactions have a `name` instead of a `counterparty`, are left out:
 * merged into the lists, they would break whatever reads the counterparty.
 */
function getPendingChanges(queryClient: QueryClient): PendingChange[] {
    return queryClient
        .getMutationCache()
        .findAll({ mutationKey: TRANSACTION_MUTATION_KEY, status: "pending" })
        .map((mutation) => ({
            action: mutation.options
                .mutationKey?.[1] as PendingChange["action"],
            transaction: mutation.state.variables as Transaction,
        }))
        .filter(
            (change) =>
                change.action === "delete" ||
                "counterparty" in change.transaction,
        );
}

/**
 * The pending changes with what the server will also change when it gets
 * them: an attached expense takes its main expense's date, a main expense's
 * date moves its attached expenses along, and deleting a main expense
 * detaches its attached expenses. `fresh` holds transactions just fetched,
 * which are newer than the cached ones.
 */
export function resolvePendingChanges(
    queryClient: QueryClient,
    fresh: Transaction[] = [],
): PendingChange[] {
    return withServerRules(getPendingChanges(queryClient), [
        ...cachedTransactions(queryClient),
        ...fresh,
    ]);
}

/**
 * `changes` plus the changes the server derives from them, given the
 * transactions `known` before them.
 */
function withServerRules(
    changes: PendingChange[],
    known: Transaction[],
): PendingChange[] {
    const byId = new Map(known.map((it) => [it.id, it]));
    const result: PendingChange[] = [];

    function save(transaction: Transaction) {
        byId.set(transaction.id, transaction);
        result.push({ action: "save", transaction });
    }

    function attachedTo(id: string) {
        return [...byId.values()].filter((it) => it.mainExpenseId === id);
    }

    for (const change of changes) {
        const { id, mainExpenseId } = change.transaction;
        switch (change.action) {
            case "delete":
                byId.delete(id);
                result.push(change);
                for (const it of attachedTo(id)) {
                    save({ ...it, mainExpenseId: null });
                }
                break;
            case "save": {
                const main =
                    mainExpenseId === null
                        ? undefined
                        : byId.get(mainExpenseId);
                const saved = main
                    ? { ...change.transaction, date: main.date }
                    : change.transaction;
                save(saved);
                for (const it of attachedTo(id)) {
                    if (it.date !== saved.date) {
                        save({ ...it, date: saved.date });
                    }
                }
                break;
            }
            default:
                throw new Error(
                    `unreachable error - type ${String(change.action satisfies never)}`,
                );
        }
    }
    return result;
}

/**
 * Applies changes to a list as the server will once it has them.
 */
export function applyToList(
    list: Transaction[],
    params: TransactionListQuery,
    changes: PendingChange[],
): Transaction[] {
    let result = list;
    for (const { action, transaction } of changes) {
        result = result.filter((t) => t.id !== transaction.id);
        if (action === "save" && matchesListQuery(transaction, params)) {
            result = [...result, transaction].sort((a, b) => b.date - a.date);
        }
    }
    return result;
}

/**
 * Applies a change, with what the server derives from it, to every cached
 * transaction list and detail.
 */
export function applyToCache(
    queryClient: QueryClient,
    change: PendingChange,
): void {
    const changes = withServerRules([change], cachedTransactions(queryClient));
    for (const [queryKey] of queryClient.getQueriesData<Transaction[]>({
        queryKey: ["transactions", "list"],
    })) {
        const params = queryKey[2] as TransactionListQuery;
        queryClient.setQueryData<Transaction[]>(queryKey, (list) =>
            list ? applyToList(list, params, changes) : list,
        );
    }

    // A deleted transaction's detail is left alone: removing it could make
    // the still-open edit page refetch it right before navigating away.
    for (const { action, transaction } of changes) {
        if (action === "save") {
            queryClient.setQueryData(
                ["transactions", "detail", transaction.id],
                transaction,
            );
        }
    }
}

/**
 * Every transaction in the cached lists, once.
 */
function cachedTransactions(queryClient: QueryClient): Transaction[] {
    const byId = new Map<string, Transaction>();
    for (const [, list] of queryClient.getQueriesData<Transaction[]>({
        queryKey: ["transactions", "list"],
    })) {
        for (const it of list ?? []) {
            byId.set(it.id, it);
        }
    }
    return [...byId.values()];
}

/**
 * The cached expenses attached to `id`, also those the current view filters
 * out.
 */
export function findAttachedExpenses(
    queryClient: QueryClient,
    id: string,
): Transaction[] {
    return cachedTransactions(queryClient).filter(
        (it) => it.mainExpenseId === id,
    );
}

/**
 * How the transaction is tied to others, from the cached lists (they also
 * hold what the current view filters out). Complete once the month of its
 * date is cached (`ensureMonthTransactions`).
 */
export function findTransactionFormRelation(
    queryClient: QueryClient,
    transaction: Transaction,
): TransactionFormRelation | undefined {
    if (transaction.mainExpenseId !== null) {
        return {
            role: "attached",
            mainExpenseCounterparty: findCachedTransaction(
                queryClient,
                transaction.mainExpenseId,
            )?.counterparty,
        };
    }
    const attachedCount = findAttachedExpenses(
        queryClient,
        transaction.id,
    ).length;
    return attachedCount > 0 ? { role: "main", attachedCount } : undefined;
}

/**
 * The cached expenses of `transaction`'s day it can be attached to, other
 * than its current main expense.
 */
export function findMainExpenseCandidates(
    queryClient: QueryClient,
    transaction: Transaction,
): Transaction[] {
    return cachedTransactions(queryClient)
        .filter(
            (it) =>
                canAttachTo(transaction, it) &&
                it.id !== transaction.mainExpenseId &&
                isSameDay(it.date, transaction.date),
        )
        .sort((a, b) => b.date - a.date);
}

/**
 * Any cached version of the transaction, e.g. to edit it offline.
 */
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
