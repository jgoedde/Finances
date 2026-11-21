import { useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@finances/shared";
import type { LucideIcon } from "lucide-react";
import { Link, Trash, Unlink } from "lucide-react";
import { toast } from "sonner";
import { ACTION_TOAST_DURATION } from "#/components/ui/sonner.tsx";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { chooseMainExpense } from "#/features/transactions/components/list/main-expense-picker.tsx";
import {
    findAttachedExpenses,
    findMainExpenseCandidates,
} from "#/features/transactions/pending-changes.ts";
import { useSaveTransaction } from "#/features/transactions/transaction-mutations.ts";
import { useDeleteWithUndo } from "#/features/transactions/use-delete-with-undo.ts";
import { m } from "#/paraglide/messages.js";

export interface TransactionAction {
    label: string;
    icon: LucideIcon;
    onSelect: VoidFunction;
}

/**
 * What a list row's menu offers: attaching an expense to another one of its
 * day (not for incomes or expenses with attached expenses), detaching an
 * attached expense and deleting without asking. Worked out on demand, from
 * the cache. `onDeleted` runs right after deleting.
 */
export function useTransactionActions(
    transaction: Transaction,
    onDeleted: VoidFunction,
): () => TransactionAction[] {
    const queryClient = useQueryClient();
    const saveTransaction = useSaveTransaction();
    const deleteWithUndo = useDeleteWithUndo();

    function saveWithUndo(changed: Transaction, message: string) {
        saveTransaction.mutate(changed);
        toast.success(`${message}${syncLaterHint()}`, {
            duration: ACTION_TOAST_DURATION,
            action: {
                label: m.action_undo(),
                onClick: () => saveTransaction.mutate(transaction),
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

    return () => {
        // Counted from the cache: the view may filter attached expenses out.
        const canAttach =
            transaction.kind === "expense" &&
            findAttachedExpenses(queryClient, transaction.id).length === 0;

        return [
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
