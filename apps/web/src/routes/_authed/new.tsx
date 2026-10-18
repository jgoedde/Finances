import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    TransactionForm,
    type TransactionFormSubmitData,
} from "#/features/transactions/components/form/transaction-form.tsx";
import { z } from "zod";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useSaveTransaction } from "#/features/transactions/transaction-mutations.ts";
import { syncLaterHint } from "#/features/sync/connectivity.ts";
import { m } from "#/paraglide/messages.js";

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
        const saved =
            data.kind === "income"
                ? m.transaction_income_saved({ name: data.name })
                : m.transaction_expense_saved({ name: data.name });
        toast.success(`${saved}${syncLaterHint()}`);
    };

    return (
        <TransactionForm
            onSubmit={onTransactionFormSubmit}
            title={m.transaction_new()}
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
