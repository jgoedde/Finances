import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/features/transactions/components/form/transaction-form.tsx";
import { toast } from "sonner";
import {
    getTransactionType,
    getTransactionTypeLabel,
} from "@/features/transactions/utils/transaction-utils.ts";
import { transactionRepository } from "@/features/transactions/transaction-repository.ts";

class TransactionNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TransactionNotFoundError";
    }
}

export const Route = createFileRoute("/edit/$id")({
    component: EditTransactionPage,
    loader: (a) => {
        const t = transactionRepository.findByIdWithCategory(a.params.id);
        if (t === undefined) {
            throw new TransactionNotFoundError("transaction not found");
        }

        return t;
    },
    onError: (error) => {
        if (error instanceof TransactionNotFoundError) {
            toast.error("Geldbewegung nicht gefunden.");
            throw redirect({ to: "/" });
        }

        toast.error(
            "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.",
        );
        throw redirect({ to: "/" });
    },
});

function EditTransactionPage() {
    const { id } = Route.useParams();

    const navigate = useNavigate();
    const transaction = Route.useLoaderData();

    const onTransactionFormSubmit = async (
        updated: TransactionFormSubmitData,
    ) => {
        try {
            await transactionRepository.update({
                id,
                category_id: updated.categoryId,
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
                    onClick: () =>
                        void transactionRepository.update(transaction),
                },
            });
        } catch {
            toast.error("Geldbewegung konnte nicht aktualisiert werden.");
        }
    };

    const onTransactionFormDelete = async () => {
        try {
            await transactionRepository.delete(id);
            await navigate({ to: "/" });
            toast.success(
                `Die ${getTransactionTypeLabel(getTransactionType(transaction.amount))} wurde gelöscht.`,
                {
                    action: {
                        label: "Wiederherstellen",
                        onClick: () =>
                            void transactionRepository.add(transaction),
                    },
                },
            );
        } catch {
            toast.error(
                `Die ${getTransactionTypeLabel(getTransactionType(transaction.amount))} konnte nicht gelöscht werden.`,
            );
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
                amount: Math.abs(transaction.amount),
                categoryId: transaction.category_id,
                type: getTransactionType(transaction.amount),
            }}
            onDelete={onTransactionFormDelete}
            onSubmit={(data) => void onTransactionFormSubmit(data)}
            title={"Geldbewegung bearbeiten"}
        />
    );
}
