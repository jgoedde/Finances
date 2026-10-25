import {
    createFileRoute,
    useCanGoBack,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
    fixedCostCategoriesQuery,
    fixedCostQuery,
    useUpdateFixedCost,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import {
    correctAmountOn,
    toFixedCost,
    toLocalIsoDate,
} from "#/features/fixed-costs/fixed-cost.ts";
import {
    loadFixedCost,
    redirectToFixedCosts,
} from "#/features/fixed-costs/fixed-cost-route.ts";
import {
    FixedCostWizard,
    type FixedCostWizardValues,
} from "#/features/fixed-costs/fixed-cost-wizard.tsx";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/fixed-costs/$id_/edit")({
    staticData: { detail: true },
    head: () => ({
        meta: [{ title: m.page_title({ page: m.fixed_cost_edit() }) }],
    }),
    component: RouteComponent,
    loader: ({ context, params }) =>
        loadFixedCost(context.queryClient, params.id),
    onError: redirectToFixedCosts,
});

function RouteComponent() {
    const router = useRouter();
    const canGoBack = useCanGoBack();
    const navigate = useNavigate();

    const { id } = Route.useParams();
    const { data: record } = useSuspenseQuery(fixedCostQuery(id));
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);
    const [today] = useState(() => toLocalIsoDate(new Date()));
    const fixedCost = toFixedCost(record, categories, today);
    const updateFixedCost = useUpdateFixedCost();

    // The form shows today's amount, so it corrects that one; price changes
    // are made on the detail page.
    function save({ amount, ...values }: FixedCostWizardValues) {
        updateFixedCost.mutate({
            id,
            patch: { ...values, ...correctAmountOn(record, today, amount) },
        });
        toast.success(m.fixed_cost_updated());
        if (canGoBack) {
            router.history.back();
        } else {
            void navigate({
                to: "/fixed-costs/$id",
                params: { id },
                replace: true,
            });
        }
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
