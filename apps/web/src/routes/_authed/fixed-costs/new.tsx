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

export const Route = createFileRoute("/_authed/fixed-costs/new")({
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

    async function save(values: FixedCostWizardValues) {
        try {
            await createFixedCost.mutateAsync({
                ...values,
                description: null,
                currency: "EUR",
                active: true,
            });
            toast.success(`Fixkosten „${values.name}“ erfasst`);
            void navigate({ to: "/" });
        } catch {
            toast.error(
                "Die Fixkosten konnten nicht gespeichert werden. Bitte versuche es erneut.",
            );
        }
    }

    return (
        <FixedCostWizard
            title={"Neue Fixkosten"}
            submitLabel={"Speichern"}
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
