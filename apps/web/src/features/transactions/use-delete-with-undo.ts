import { useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@finances/shared";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { ACTION_TOAST_DURATION } from "#/components/ui/sonner.tsx";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import {
    findAttachedExpenses,
    findCachedTransaction,
} from "#/features/transactions/pending-changes.ts";
import {
    useDeleteTransaction,
    useSaveTransaction,
} from "#/features/transactions/transaction-mutations.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Deletes a transaction without asking and offers to undo it in a snackbar.
 * Deleted ids can't be reused, so undoing saves a copy under a new id and
 * attaches the expenses that were attached to the deleted one to the copy.
 */
export function useDeleteWithUndo(): (transaction: Transaction) => void {
    const queryClient = useQueryClient();
    const saveTransaction = useSaveTransaction();
    const deleteTransaction = useDeleteTransaction();

    return (transaction) => {
        // Before deleting: the deletion detaches them.
        const attachedIds = findAttachedExpenses(
            queryClient,
            transaction.id,
        ).map((it) => it.id);
        deleteTransaction.mutate(transaction);

        function undo() {
            const copy = { ...transaction, id: nanoid(8) };
            saveTransaction.mutate(copy);
            for (const id of attachedIds) {
                // Their latest version: deleted or attached elsewhere since
                // means they stay as they are.
                const attached = findCachedTransaction(queryClient, id);
                if (attached?.mainExpenseId === null) {
                    saveTransaction.mutate({
                        ...attached,
                        mainExpenseId: copy.id,
                    });
                }
            }
        }

        const deleted =
            transaction.kind === "income"
                ? m.transaction_income_deleted()
                : m.transaction_expense_deleted();
        toast.success(`${deleted}${syncLaterHint()}`, {
            duration: ACTION_TOAST_DURATION,
            action: { label: m.action_undo(), onClick: undo },
        });
    };
}
