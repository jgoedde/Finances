import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fixedCostIntervalSchema } from "@finances/shared";
import { z } from "zod";
import {
    fixedCostCategoriesQuery,
    useCreateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import {
    FixedCostWizard,
    type FixedCostWizardValues,
} from "#/features/fixed-costs/fixed-cost-wizard.tsx";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { acceptFixedCostSuggestion } from "#/features/fixed-costs/fixed-cost-suggestion.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Prefilled from a fixed cost suggestion; `name` is its counterparty.
 */
const suggestionSchema = z.object({
    name: z.string().nonempty().optional().catch(undefined),
    amount: z.number().nonnegative().optional().catch(undefined),
    interval: fixedCostIntervalSchema.optional().catch(undefined),
    startDate: z.iso.date().optional().catch(undefined),
});

export const Route = createFileRoute("/_authed/_shell/fixed-costs/new")({
    staticData: { detail: true },
    head: () => ({
        meta: [{ title: m.page_title({ page: m.fixed_cost_new() }) }],
    }),
    component: RouteComponent,
    validateSearch: suggestionSchema,
    loader: ({ context }) =>
        context.queryClient.query({
            ...fixedCostCategoriesQuery,
            staleTime: "static",
        }),
});

// Nothing is saved until the last step: leaving early discards the draft.
function RouteComponent() {
    const suggestion = Route.useSearch();
    const navigate = useNavigate();
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);
    const createFixedCost = useCreateFixedCost();

    function save({ amount, ...values }: FixedCostWizardValues) {
        createFixedCost
            .mutateAsync({
                ...values,
                initialAmount: amount,
                priceChanges: [],
                description: null,
                currency: "EUR",
                active: true,
            })
            .then(() => {
                if (suggestion.name !== undefined) {
                    acceptFixedCostSuggestion(suggestion.name);
                }
            })
            // The mutation reports its errors itself.
            .catch(() => {});
        toast.success(m.fixed_cost_created({ name: values.name }));
        void navigate({ to: "/fixed-costs" });
    }

    return (
        <FixedCostWizard
            title={m.fixed_cost_new()}
            submitLabel={m.action_save()}
            initialValues={{
                name: suggestion.name ?? "",
                amount: suggestion.amount ?? null,
                interval: suggestion.interval ?? "monthly",
                startDate:
                    suggestion.startDate === undefined
                        ? undefined
                        : fromIsoDate(suggestion.startDate),
                endDate: null,
                categoryId: undefined,
            }}
            categories={categories}
            onSubmit={save}
        />
    );
}
