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
import { ApiError } from "#/api/api-client.ts";
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
        if (error instanceof ApiError && error.status === 404) {
            toast.error("Fixkostenstelle nicht gefunden.");
            throw redirect({ to: "/" });
        }

        toast.error(
            "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es erneut.",
        );
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

    async function save(values: FixedCostWizardValues) {
        try {
            await updateFixedCost.mutateAsync({ id, patch: values });
            toast.success("Fixkosten aktualisiert");
            void navigate({ to: "/" });
        } catch {
            toast.error(
                "Die Fixkosten konnten nicht gespeichert werden. Bitte versuche es erneut.",
            );
        }
    }

    return (
        <FixedCostWizard
            title={"Fixkosten bearbeiten"}
            submitLabel={"Aktualisieren"}
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
