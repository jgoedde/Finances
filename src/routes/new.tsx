import {
    createFileRoute,
    useCanGoBack,
    useRouter,
} from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/components/transactions/editor/transaction-form.tsx";
import { z } from "zod";
import { TransactionType } from "@/persistence/types.ts";
import { transactionsRepository } from "@/persistence/repository.ts";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { getTransactionTypeLabel } from "@/lib/transaction-utils.ts";

const prefilledSchema = z.object({
    vendor: z.string().nonempty().optional().catch(undefined),
    amount: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/new")({
    component: NewTransactionPage,
    validateSearch: prefilledSchema,
});

const now = new Date();

function NewTransactionPage() {
    const { vendor, amount } = Route.useSearch();
    const canGoBack = useCanGoBack();
    const router = useRouter();

    const onTransactionFormSubmit = async (data: TransactionFormSubmitData) => {
        try {
            await transactionsRepository.add({
                id: nanoid(8),
                date: data.date.getTime(),
                category_id: data.categoryId,
                amount: data.amount,
                currency: "EUR",
                name: data.name,
                description: data.description,
                exceptional: data.isExceptional,
            });

            if (canGoBack) {
                router.history.back();
            } else {
                await router.navigate({ to: "/" });
            }
            toast.success(
                `${getTransactionTypeLabel(data.type)} bei ${data.name} gespeichert`,
            );
        } catch {
            toast.error(
                `Die ${getTransactionTypeLabel(data.type)} konnte leider nicht gespeichert werden.`,
            );
        }
    };

    return (
        <TransactionForm
            onSubmit={(data) => void onTransactionFormSubmit(data)}
            title={"Neue Geldbewegung"}
            initialValues={{
                name: vendor ?? "",
                description: "",
                date: now,
                type: TransactionType.expense,
                isExceptional: false,
                showSuggestions: true,
                amount,
                categoryId: undefined,
            }}
        />
    );
}
