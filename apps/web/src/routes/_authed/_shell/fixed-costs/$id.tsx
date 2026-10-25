import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FixedCostDetail } from "#/features/fixed-costs/detail/fixed-cost-detail.tsx";
import {
    fixedCostCategoriesQuery,
    fixedCostQuery,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import {
    loadFixedCost,
    redirectToFixedCosts,
} from "#/features/fixed-costs/fixed-cost-route.ts";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/_authed/_shell/fixed-costs/$id")({
    staticData: { detail: true },
    component: RouteComponent,
    loader: ({ context, params }) =>
        loadFixedCost(context.queryClient, params.id),
    // After `loader`, so `loaderData` is typed.
    head: ({ loaderData }) => ({
        meta: [
            {
                title: m.page_title({
                    page: loaderData?.[0].name ?? m.fixed_costs_title(),
                }),
            },
        ],
    }),
    onError: redirectToFixedCosts,
});

function RouteComponent() {
    const { id } = Route.useParams();
    const { data: record } = useSuspenseQuery(fixedCostQuery(id));
    const { data: categories } = useSuspenseQuery(fixedCostCategoriesQuery);

    return <FixedCostDetail record={record} categories={categories} />;
}
