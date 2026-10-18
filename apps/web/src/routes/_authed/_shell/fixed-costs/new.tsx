import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    fixedCostCategoriesQuery,
    useCreateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import {
    FixedCostWizard,
    type FixedCostWizardValues,
} from "#/features/fixed-costs/fixed-cost-wizard.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/fixed-costs/new")({
    staticData: { detail: true },
    head: () => ({
        meta: [{ title: m.page_title({ page: m.fixed_cost_new() }) }],
    }),
    component: RouteComponent,
    loader: ({ context }) =>
        context.queryClient.query({
            ...fixedCostCategoriesQuery,
            staleTime: "static",
        }),
});

// Nothing is saved until the last step: leaving early discards the draft.
function RouteComponent() {
    const navigate = useNavigate();
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);
    const createFixedCost = useCreateFixedCost();

    function save(values: FixedCostWizardValues) {
        createFixedCost.mutate({
            ...values,
            description: null,
            currency: "EUR",
            active: true,
        });
        toast.success(m.fixed_cost_created({ name: values.name }));
        void navigate({ to: "/fixed-costs" });
    }

    return (
        <FixedCostWizard
            title={m.fixed_cost_new()}
            submitLabel={m.action_save()}
            initialValues={{
                name: "",
                amount: null,
                interval: "monthly",
                endDate: null,
                categoryId: undefined,
            }}
            categories={categories}
            onSubmit={save}
        />
    );
}
