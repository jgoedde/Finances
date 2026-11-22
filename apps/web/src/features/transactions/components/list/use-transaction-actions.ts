import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { Transaction } from "@finances/shared";
import type { IconComponent } from "#/lib/icon.ts";
import CalendarMonth from "~icons/material-symbols/calendar-month-outline-rounded";
import Link from "~icons/material-symbols/link-rounded";
import Trash from "~icons/material-symbols/delete-outline-rounded";
import Unlink from "~icons/material-symbols/link-off-rounded";
import { toast } from "sonner";
import { ACTION_TOAST_DURATION } from "#/components/ui/sonner.tsx";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { useShowInMonth } from "#/features/transactions/components/list/month-landing.ts";
import { chooseMainExpense } from "#/features/transactions/components/list/main-expense-picker.tsx";
import {
    findAttachedExpenses,
    findMainExpenseCandidates,
} from "#/features/transactions/pending-changes.ts";
import { useSaveTransaction } from "#/features/transactions/transaction-mutations.ts";
import * as haptics from "#/lib/haptics.ts";
import { useDeleteWithUndo } from "#/features/transactions/use-delete-with-undo.ts";
import { m } from "#/paraglide/messages.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

export interface TransactionAction {
    label: string;
    icon: IconComponent;
    onSelect: VoidFunction;
}

/**
 * What a list row's menu offers: showing it in its unfiltered month while a
 * search or category filter is active, attaching an expense to another one of its
 * day (not for incomes or expenses with attached expenses), detaching an
 * attached expense and deleting without asking. Worked out on demand, from
 * the cache; attaching needs the month of the transaction's date, which
 * holds its attached expenses and the candidates. `onDeleted` runs right
 * after deleting.
 */
export function useTransactionActions(
    transaction: Transaction,
    onDeleted: VoidFunction,
): (isMonthLoaded: boolean) => TransactionAction[] {
    const queryClient = useQueryClient();
    const saveTransaction = useSaveTransaction();
    const deleteWithUndo = useDeleteWithUndo();
    const showInMonth = useShowInMonth();
    const { q, category } = transactionsRoute.useSearch();
    const isFiltered = Boolean(q?.trim()) || category !== undefined;

    function saveWithUndo(changed: Transaction, message: string) {
        saveTransaction.mutate(changed);
        toast.success(`${message}${syncLaterHint()}`, {
            duration: ACTION_TOAST_DURATION,
            action: {
                label: m.action_undo(),
                onClick: () => {
                    haptics.tick();
                    saveTransaction.mutate(transaction);
                },
            },
        });
    }

    async function attach() {
        const main = await chooseMainExpense(
            findMainExpenseCandidates(queryClient, transaction),
        );
        if (main) {
            saveWithUndo(
                { ...transaction, mainExpenseId: main.id },
                m.transaction_attached_to({ counterparty: main.counterparty }),
            );
        }
    }

    return (isMonthLoaded) => {
        // Counted from the cache: the view may filter attached expenses out.
        const canAttach =
            isMonthLoaded &&
            transaction.kind === "expense" &&
            findAttachedExpenses(queryClient, transaction.id).length === 0;

        return [
            isFiltered && {
                label: m.transaction_show_in_month(),
                icon: CalendarMonth,
                onSelect: () =>
                    showInMonth(new Date(transaction.date), [transaction.id]),
            },
            canAttach && {
                label: m.transaction_attach_to(),
                icon: Link,
                onSelect: () => void attach(),
            },
            transaction.mainExpenseId !== null && {
                label: m.transaction_detach(),
                icon: Unlink,
                onSelect: () =>
                    saveWithUndo(
                        { ...transaction, mainExpenseId: null },
                        m.transaction_detached(),
                    ),
            },
            {
                label: m.action_delete(),
                icon: Trash,
                onSelect: () => {
                    deleteWithUndo(transaction);
                    onDeleted();
                },
            },
        ].filter((action) => action !== false);
    };
}
