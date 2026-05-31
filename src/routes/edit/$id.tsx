import {
    createFileRoute,
    redirect,
    useCanGoBack,
    useRouter,
} from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/components/transactions/editor/transaction-form.tsx";
import { transactionsRepository } from "@/persistence/repository.ts";
import { toast } from "sonner";
import {
    getTransactionType,
    getTransactionTypeLabel,
} from "@/lib/transaction-utils.ts";

class TransactionNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TransactionNotFoundError";
    }
}

export const Route = createFileRoute("/edit/$id")({
    component: EditTransactionPage,
    loader: (a) => {
        const t = transactionsRepository.findByIdWithCategory(a.params.id);
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
    const transaction = Route.useLoaderData();

    const canGoBack = useCanGoBack();
    const router = useRouter();

    const onTransactionFormSubmit = async (
        updated: TransactionFormSubmitData,
    ) => {
        try {
            await transactionsRepository.update({
                id,
                category_id: updated.categoryId,
                amount: updated.amount,
                name: updated.name,
                description: updated.description,
                date: updated.date.getTime(),
                exceptional: updated.isExceptional,
                currency: "EUR",
            });
            if (canGoBack) {
                router.history.back();
            } else {
                await router.navigate({ to: "/" });
            }
            toast.success("Geldbewegung aktualisiert", {
                action: {
                    label: "Rückgängig",
                    onClick: () =>
                        void transactionsRepository.update(transaction),
                },
            });
        } catch {
            toast.error("Geldbewegung konnte nicht aktualisiert werden.");
        }
    };

    const onTransactionFormDelete = async () => {
        try {
            await transactionsRepository.delete(id);
            if (canGoBack) {
                router.history.back();
            } else {
                await router.navigate({ to: "/" });
            }
            toast.success(
                `Die ${getTransactionTypeLabel(getTransactionType(transaction.amount))} wurde gelöscht.`,
                {
                    action: {
                        label: "Wiederherstellen",
                        onClick: () =>
                            void transactionsRepository.add(transaction),
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
