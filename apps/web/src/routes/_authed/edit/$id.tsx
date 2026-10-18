import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form.tsx";
import { toast } from "sonner";
import { transactionQuery } from "#/features/transactions/transaction-queries.ts";
import {
    useDeleteTransaction,
    useSaveTransaction,
} from "#/features/transactions/transaction-mutations.ts";
import { findCachedTransaction } from "#/features/transactions/pending-changes.ts";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { apiErrorCode } from "#/api/api-errors.ts";
import { m } from "#/paraglide/messages.js";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/_authed/edit/$id")({
    component: RouteComponent,
    loader: ({ context: { queryClient }, params }) => {
        // Offline, a transaction only seen in a list can still be edited.
        const query = transactionQuery(params.id);
        if (!queryClient.getQueryData(query.queryKey)) {
            const cached = findCachedTransaction(queryClient, params.id);
            if (cached) {
                queryClient.setQueryData(query.queryKey, cached);
            }
        }
        return queryClient.query({ ...query, staleTime: "static" });
    },
    onError: (error) => {
        if (apiErrorCode(error) === "not_found") {
            toast.error(m.transaction_not_found());
            throw redirect({ to: "/" });
        }

        toast.error(m.error_unexpected());
        throw redirect({ to: "/" });
    },
});

function RouteComponent() {
    const { id } = Route.useParams();

    const navigate = useNavigate();
    const { data: transaction } = useSuspenseQuery(transactionQuery(id));
    const saveTransaction = useSaveTransaction();
    const deleteTransaction = useDeleteTransaction();

    const onTransactionFormSubmit = (updated: TransactionFormSubmitData) => {
        saveTransaction.mutate({
            id,
            categoryId: updated.categoryId,
            kind: updated.kind,
            amount: updated.amount,
            name: updated.name,
            description: updated.description,
            date: updated.date.getTime(),
            exceptional: updated.isExceptional,
            currency: "EUR",
        });
        void navigate({ to: "/" });
        toast.success(`${m.transaction_updated()}${syncLaterHint()}`, {
            action: {
                label: m.action_undo(),
                onClick: () => saveTransaction.mutate(transaction),
            },
        });
    };

    const onTransactionFormDelete = () => {
        deleteTransaction.mutate(transaction);
        void navigate({ to: "/" });
        // Deleted ids can't be reused, so restoring saves a copy.
        const deleted =
            transaction.kind === "income"
                ? m.transaction_income_deleted()
                : m.transaction_expense_deleted();
        toast.success(`${deleted}${syncLaterHint()}`, {
            action: {
                label: m.action_restore(),
                onClick: () =>
                    saveTransaction.mutate({
                        ...transaction,
                        id: nanoid(8),
                    }),
            },
        });
    };

    return (
        <TransactionForm
            initialValues={{
                showSuggestions: false,
                isExceptional: transaction.exceptional,
                date: new Date(transaction.date),
                description: transaction.description ?? "",
                name: transaction.name,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                kind: transaction.kind,
            }}
            onDelete={onTransactionFormDelete}
            onSubmit={onTransactionFormSubmit}
            title={m.transaction_edit()}
        />
    );
}
