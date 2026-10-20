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
} from "@finances/shared";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { apiFetch } from "#/api/api-client.ts";
import {
    type FixedCostCategoryGroup,
    toCategoryGroups,
} from "#/features/fixed-costs/fixed-cost.ts";
import { m } from "#/paraglide/messages.js";

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

export function useFixedCostCategoryGroups(): FixedCostCategoryGroup[] {
    const records = useQuery(fixedCostsQuery).data ?? EMPTY;
    const categories = useFixedCostCategories();
    return toCategoryGroups(records, categories);
}

export function fixedCostQuery(id: string) {
    return queryOptions({
        queryKey: ["fixed-costs", "detail", id],
        queryFn: () => apiFetch<FixedCostRecord>(`/fixed-costs/${id}`),
    });
}

type FixedCostList = FixedCostRecord[] | undefined;

/**
 * Server order of the list (`ORDER BY name`, binary collation).
 */
function byName(a: FixedCostRecord, b: FixedCostRecord): number {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * Optimistic mutation helpers: update the list right away, roll it back with
 * a toast on error and refetch once settled. Fixed costs are online-only, so
 * nothing is queued.
 */
function useOptimisticFixedCosts(errorMessage: () => string) {
    const queryClient = useQueryClient();
    return {
        async apply(update: (list: FixedCostRecord[]) => FixedCostRecord[]) {
            await queryClient.cancelQueries({ queryKey: ["fixed-costs"] });
            const previous = queryClient.getQueryData<FixedCostRecord[]>(
                fixedCostsQuery.queryKey,
            );
            queryClient.setQueryData<FixedCostRecord[]>(
                fixedCostsQuery.queryKey,
                (list) => list && update(list),
            );
            return { previous };
        },
        rollback(context: { previous: FixedCostList } | undefined) {
            if (context) {
                queryClient.setQueryData(
                    fixedCostsQuery.queryKey,
                    context.previous,
                );
            }
            toast.error(errorMessage());
        },
        settle: () =>
            queryClient.invalidateQueries({ queryKey: ["fixed-costs"] }),
    };
}

export function useCreateFixedCost() {
    const optimistic = useOptimisticFixedCosts(m.fixed_cost_save_failed);
    return useMutation({
        mutationFn: (input: FixedCostInput) =>
            apiFetch<FixedCostRecord>("/fixed-costs", {
                method: "POST",
                body: input,
            }),
        // The server assigns the id; a temporary one stands in until then.
        onMutate: (input) =>
            optimistic.apply((list) =>
                [...list, { ...input, id: `pending-${nanoid(8)}` }].sort(
                    byName,
                ),
            ),
        onError: (_error, _input, context) => optimistic.rollback(context),
        onSettled: optimistic.settle,
    });
}

export function useUpdateFixedCost() {
    const optimistic = useOptimisticFixedCosts(m.fixed_cost_update_failed);
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: FixedCostPatch }) =>
            apiFetch<FixedCostRecord>(`/fixed-costs/${id}`, {
                method: "PATCH",
                body: patch,
            }),
        onMutate: ({ id, patch }) =>
            optimistic.apply((list) =>
                list
                    .map((record) =>
                        record.id === id ? { ...record, ...patch } : record,
                    )
                    .sort(byName),
            ),
        onError: (_error, _variables, context) => optimistic.rollback(context),
        onSettled: optimistic.settle,
    });
}

export function useDeleteFixedCost() {
    const optimistic = useOptimisticFixedCosts(m.fixed_cost_delete_failed);
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<undefined>(`/fixed-costs/${id}`, { method: "DELETE" }),
        onMutate: (id) =>
            optimistic.apply((list) =>
                list.filter((record) => record.id !== id),
            ),
        onError: (_error, _id, context) => optimistic.rollback(context),
        onSettled: optimistic.settle,
    });
}
