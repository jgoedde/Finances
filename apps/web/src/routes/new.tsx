import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/features/transactions/components/form/transaction-form.tsx";
import { z } from "zod";
import { TransactionType } from "@/persistence/types.ts";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { getTransactionTypeLabel } from "@/features/transactions/utils/transaction-utils.ts";
import { transactionRepository } from "@/features/transactions/transaction-repository.ts";

const prefilledSchema = z.object({
    vendor: z.string().nonempty().optional().catch(undefined),
    amount: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/new")({
    component: RouteComponent,
    validateSearch: prefilledSchema,
});

const now = new Date();

function RouteComponent() {
    const { vendor, amount } = Route.useSearch();
    const navigate = useNavigate();

    const onTransactionFormSubmit = async (data: TransactionFormSubmitData) => {
        try {
            await transactionRepository.add({
                id: nanoid(8),
                date: data.date.getTime(),
                category_id: data.categoryId,
                amount: data.amount,
                currency: "EUR",
                name: data.name,
                description: data.description,
                exceptional: data.isExceptional,
            });

            await navigate({ to: "/" });
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
