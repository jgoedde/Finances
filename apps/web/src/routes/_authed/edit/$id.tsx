import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form.tsx";
import { toast } from "sonner";
import { getTransactionKindLabel } from "#/features/transactions/utils/transaction-utils.ts";
import { transactionQuery } from "#/features/transactions/transaction-queries.ts";
import {
    useDeleteTransaction,
    useSaveTransaction,
} from "#/features/transactions/transaction-mutations.ts";
import { findCachedTransaction } from "#/features/transactions/pending-changes.ts";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { ApiError } from "#/api/api-client.ts";
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
        if (error instanceof ApiError && error.status === 404) {
            toast.error("Geldbewegung nicht gefunden.");
            throw redirect({ to: "/" });
        }

        toast.error(
            "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.",
        );
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
        toast.success(`Geldbewegung aktualisiert${syncLaterHint()}`, {
            action: {
                label: "Rückgängig",
                onClick: () => saveTransaction.mutate(transaction),
            },
        });
    };

    const onTransactionFormDelete = () => {
        deleteTransaction.mutate(transaction);
        void navigate({ to: "/" });
        // Deleted ids can't be reused, so restoring saves a copy.
        toast.success(
            `Die ${getTransactionKindLabel(transaction.kind)} wurde gelöscht.${syncLaterHint()}`,
            {
                action: {
                    label: "Wiederherstellen",
                    onClick: () =>
                        saveTransaction.mutate({
                            ...transaction,
                            id: nanoid(8),
                        }),
                },
            },
        );
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
            title={"Geldbewegung bearbeiten"}
        />
    );
}
