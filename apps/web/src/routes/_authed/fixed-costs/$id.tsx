import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    fixedCostCategoriesQuery,
    fixedCostQuery,
    useUpdateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import { toFixedCost } from "#/features/fixed-costs/fixed-cost.ts";
import {
    FixedCostWizard,
    type FixedCostWizardValues,
} from "#/features/fixed-costs/fixed-cost-wizard.tsx";
import { apiErrorCode } from "#/api/api-errors.ts";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/fixed-costs/$id")({
    component: RouteComponent,
    loader: ({ context, params }) =>
        Promise.all([
            context.queryClient.query({
                ...fixedCostQuery(params.id),
                staleTime: "static",
            }),
            context.queryClient.query({
                ...fixedCostCategoriesQuery,
                staleTime: "static",
            }),
        ]),
    onError: (error) => {
        if (apiErrorCode(error) === "not_found") {
            toast.error(m.fixed_cost_not_found());
            throw redirect({ to: "/" });
        }

        toast.error(m.error_unexpected());
        throw redirect({ to: "/" });
    },
});

function RouteComponent() {
    const navigate = useNavigate();

    const { id } = Route.useParams();
    const { data: record } = useSuspenseQuery(fixedCostQuery(id));
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);
    const fixedCost = toFixedCost(record, categories);
    const updateFixedCost = useUpdateFixedCost();

    function save(values: FixedCostWizardValues) {
        updateFixedCost.mutate({ id, patch: values });
        toast.success(m.fixed_cost_updated());
        void navigate({ to: "/" });
    }

    return (
        <FixedCostWizard
            title={m.fixed_cost_edit()}
            submitLabel={m.action_update()}
            initialValues={{
                name: fixedCost.name,
                amount: fixedCost.amount,
                interval: fixedCost.interval,
                startDate: fixedCost.startDate,
                endDate: fixedCost.endDate,
                categoryId: record.categoryId,
            }}
            categories={categories}
            onSubmit={save}
        />
    );
}
