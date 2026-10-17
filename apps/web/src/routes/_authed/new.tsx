import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "@/features/transactions/components/form/transaction-form.tsx";
import { z } from "zod";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { getTransactionKindLabel } from "@/features/transactions/utils/transaction-utils.ts";
import { useSaveTransaction } from "@/features/transactions/transaction-mutations.ts";
import { syncLaterHint } from "@/features/sync/connectivity.ts";

const prefilledSchema = z.object({
    vendor: z.string().nonempty().optional().catch(undefined),
    amount: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/_authed/new")({
    component: RouteComponent,
    validateSearch: prefilledSchema,
});

const now = new Date();

function RouteComponent() {
    const { vendor, amount } = Route.useSearch();
    const navigate = useNavigate();
    const saveTransaction = useSaveTransaction();

    const onTransactionFormSubmit = (data: TransactionFormSubmitData) => {
        // Saved locally right away; sent now or once back online.
        saveTransaction.mutate({
            id: nanoid(8),
            date: data.date.getTime(),
            categoryId: data.categoryId,
            kind: data.kind,
            amount: data.amount,
            currency: "EUR",
            name: data.name,
            description: data.description,
            exceptional: data.isExceptional,
        });

        void navigate({ to: "/" });
        toast.success(
            `${getTransactionKindLabel(data.kind)} bei ${data.name} gespeichert${syncLaterHint()}`,
        );
    };

    return (
        <TransactionForm
            onSubmit={onTransactionFormSubmit}
            title={"Neue Geldbewegung"}
            initialValues={{
                name: vendor ?? "",
                description: "",
                date: now,
                kind: "expense",
                isExceptional: false,
                showSuggestions: true,
                amount,
                categoryId: undefined,
            }}
        />
    );
}
