import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/features/transactions/components/form/transaction-form.tsx";
import { toast } from "sonner";
import { getTransactionKindLabel } from "@/features/transactions/utils/transaction-utils.ts";
import {
    transactionQuery,
    useDeleteTransaction,
    useSaveTransaction,
} from "@/features/transactions/transaction-queries.ts";
import { ApiError } from "@/api/api-client.ts";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/_authed/edit/$id")({
    component: RouteComponent,
    loader: ({ context, params }) =>
        context.queryClient.ensureQueryData(transactionQuery(params.id)),
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

    const onTransactionFormSubmit = async (
        updated: TransactionFormSubmitData,
    ) => {
        try {
            await saveTransaction.mutateAsync({
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
            await navigate({ to: "/" });
            toast.success("Geldbewegung aktualisiert", {
                action: {
                    label: "Rückgängig",
                    onClick: () => saveTransaction.mutate(transaction),
                },
            });
        } catch {
            toast.error("Geldbewegung konnte nicht aktualisiert werden.");
        }
    };

    const onTransactionFormDelete = async () => {
        const label = getTransactionKindLabel(transaction.kind);
        try {
            await deleteTransaction.mutateAsync(id);
            await navigate({ to: "/" });
            // Deleted ids can't be reused, so restoring saves a copy.
            toast.success(`Die ${label} wurde gelöscht.`, {
                action: {
                    label: "Wiederherstellen",
                    onClick: () =>
                        saveTransaction.mutate({
                            ...transaction,
                            id: nanoid(8),
                        }),
                },
            });
        } catch {
            toast.error(`Die ${label} konnte nicht gelöscht werden.`);
        }
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
            onSubmit={(data) => void onTransactionFormSubmit(data)}
            title={"Geldbewegung bearbeiten"}
        />
    );
}
