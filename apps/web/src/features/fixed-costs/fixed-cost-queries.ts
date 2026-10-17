import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type {
    FixedCost as FixedCostRecord,
    FixedCostCategory,
    FixedCostInput,
    FixedCostPatch,
    MonthlyTotal,
} from "@finances/shared";
import { apiFetch } from "#/api/api-client.ts";
import {
    type FixedCost,
    toFixedCost,
} from "#/features/fixed-costs/fixed-cost.ts";

const EMPTY: never[] = [];

export const fixedCostCategoriesQuery = queryOptions({
    queryKey: ["fixed-cost-categories"],
    queryFn: () => apiFetch<FixedCostCategory[]>("/fixed-cost-categories"),
    staleTime: Infinity,
});

function useFixedCostCategories(): FixedCostCategory[] {
    return useQuery(fixedCostCategoriesQuery).data ?? EMPTY;
}

export const fixedCostsQuery = queryOptions({
    queryKey: ["fixed-costs", "list"],
    queryFn: () => apiFetch<FixedCostRecord[]>("/fixed-costs"),
});

export function useFixedCosts(): FixedCost[] {
    const records = useQuery(fixedCostsQuery).data ?? EMPTY;
    const categories = useFixedCostCategories();
    return records.map((record) => toFixedCost(record, categories));
}

export function fixedCostQuery(id: string) {
    return queryOptions({
        queryKey: ["fixed-costs", "detail", id],
        queryFn: () => apiFetch<FixedCostRecord>(`/fixed-costs/${id}`),
    });
}

export function useMonthlyFixedCostTotal(): number {
    return (
        useQuery({
            queryKey: ["fixed-costs", "monthly-total"],
            queryFn: () => apiFetch<MonthlyTotal>("/fixed-costs/monthly-total"),
        }).data?.total ?? 0
    );
}

export function useCreateFixedCost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: FixedCostInput) =>
            apiFetch<FixedCostRecord>("/fixed-costs", {
                method: "POST",
                body: input,
            }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: ["fixed-costs"] }),
    });
}

export function useUpdateFixedCost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: FixedCostPatch }) =>
            apiFetch<FixedCostRecord>(`/fixed-costs/${id}`, {
                method: "PATCH",
                body: patch,
            }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: ["fixed-costs"] }),
    });
}

export function useDeleteFixedCost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<undefined>(`/fixed-costs/${id}`, { method: "DELETE" }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: ["fixed-costs"] }),
    });
}
