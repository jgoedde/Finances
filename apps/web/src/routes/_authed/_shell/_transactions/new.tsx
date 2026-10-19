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

export const Route = createFileRoute("/_authed/_shell/_transactions/new")({
    staticData: { detail: true },
    head: () => ({
        meta: [{ title: m.page_title({ page: m.transaction_new() }) }],
    }),
    component: RouteComponent,
    validateSearch: prefilledSchema,
});

const now = new Date();

function RouteComponent() {
    const { vendor, amount } = Route.useSearch();
    const navigate = useNavigate();
    const saveTransaction = useSaveTransaction();

    const onTransactionFormSubmit = (data: TransactionFormSubmitData) => {
        // Saved locally right away; sent now or once back online. A split
        // becomes unlinked transactions sharing counterparty, date and kind.
        const common = {
            date: data.date.getTime(),
            kind: data.kind,
            currency: "EUR",
            name: data.name,
            exceptional: data.isExceptional,
        } as const;
        const drafts = [
            {
                categoryId: data.categoryId,
                amount: data.amount,
                description: data.description,
            },
            ...data.parts,
        ];
        for (const draft of drafts) {
            saveTransaction.mutate({
                id: nanoid(8),
                ...common,
                ...draft,
            });
        }

        void navigate({ to: "/transactions" });
        toast.success(`${savedMessage(data, drafts.length)}${syncLaterHint()}`);
    };

    return (
        <TransactionForm
            canSplit
            onSubmit={onTransactionFormSubmit}
            title={m.transaction_new()}
            initialValues={{
                name: vendor ?? "",
                description: "",
                date: now,
                kind: "expense",
                isExceptional: false,
                predict: true,
                amount,
                categoryId: undefined,
            }}
        />
    );
}

function savedMessage(
    { kind, name }: TransactionFormSubmitData,
    count: number,
): string {
    if (count > 1) {
        return kind === "income"
            ? m.transaction_incomes_saved({ count, name })
            : m.transaction_expenses_saved({ count, name });
    }
    return kind === "income"
        ? m.transaction_income_saved({ name })
        : m.transaction_expense_saved({ name });
}
