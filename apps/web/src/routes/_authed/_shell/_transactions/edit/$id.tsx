import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form.tsx";
import { toast } from "sonner";
import { ACTION_TOAST_DURATION } from "#/components/ui/sonner.tsx";
import {
    ensureMonthTransactions,
    transactionQuery,
} from "#/features/transactions/transaction-queries.ts";
import { useSaveTransaction } from "#/features/transactions/transaction-mutations.ts";
import { useDeleteWithUndo } from "#/features/transactions/use-delete-with-undo.ts";
import {
    findCachedTransaction,
    findTransactionFormRelation,
} from "#/features/transactions/pending-changes.ts";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { apiErrorCode } from "#/api/api-errors.ts";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/_transactions/edit/$id")({
    staticData: { detail: true },
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        // Offline, a transaction only seen in a list can still be edited.
        const query = transactionQuery(params.id);
        if (!queryClient.getQueryData(query.queryKey)) {
            const cached = findCachedTransaction(queryClient, params.id);
            if (cached) {
                queryClient.setQueryData(query.queryKey, cached);
            }
        }
        const transaction = await queryClient.query({
            ...query,
            staleTime: "static",
        });
        // Its month holds its attached expenses, which lock fields and are
        // moved and restored along with it.
        await ensureMonthTransactions(queryClient, transaction.date);
        return transaction;
    },
    // After `loader`, so `loaderData` is typed.
    head: ({ loaderData }) => ({
        meta: [
            {
                title: m.page_title({
                    page: loaderData?.counterparty ?? m.transaction_edit(),
                }),
            },
        ],
    }),
    onError: (error) => {
        if (apiErrorCode(error) === "not_found") {
            toast.error(m.transaction_not_found());
            throw redirect({ to: "/transactions" });
        }

        toast.error(m.error_unexpected());
        throw redirect({ to: "/transactions" });
    },
});

function RouteComponent() {
    const { id } = Route.useParams();

    const navigate = useNavigate();
    const { data: transaction } = useSuspenseQuery(transactionQuery(id));
    const saveTransaction = useSaveTransaction();
    const deleteWithUndo = useDeleteWithUndo();
    const queryClient = useQueryClient();

    const onTransactionFormSubmit = (updated: TransactionFormSubmitData) => {
        saveTransaction.mutate({
            id,
            categoryId: updated.categoryId,
            kind: updated.kind,
            amount: updated.amount,
            counterparty: updated.counterparty,
            description: updated.description,
            date: updated.date.getTime(),
            exceptional: updated.isExceptional,
            currency: "EUR",
            location: transaction.location,
            mainExpenseId: transaction.mainExpenseId,
        });
        void navigate({ to: "/transactions" });
        toast.success(`${m.transaction_updated()}${syncLaterHint()}`, {
            duration: ACTION_TOAST_DURATION,
            action: {
                label: m.action_undo(),
                onClick: () => saveTransaction.mutate(transaction),
            },
        });
    };

    const onTransactionFormDelete = () => {
        deleteWithUndo(transaction);
        void navigate({ to: "/transactions" });
    };

    return (
        <TransactionForm
            initialValues={{
                predict: false,
                isExceptional: transaction.exceptional,
                date: new Date(transaction.date),
                description: transaction.description ?? "",
                counterparty: transaction.counterparty,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                kind: transaction.kind,
            }}
            onDelete={onTransactionFormDelete}
            onSubmit={onTransactionFormSubmit}
            title={m.transaction_edit()}
            relation={findTransactionFormRelation(queryClient, transaction)}
        />
    );
}
