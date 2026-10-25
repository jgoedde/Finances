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
    UpdateFixedCostCategory,
} from "@finances/shared";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "#/api/api-client.ts";
import {
    type FixedCostCategoryGroup,
    toCategoryGroups,
    toLocalIsoDate,
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

const fixedCostsQuery = queryOptions({
    queryKey: ["fixed-costs", "list"],
    queryFn: () => apiFetch<FixedCostRecord[]>("/fixed-costs"),
});

export function useFixedCostCategoryGroups(): FixedCostCategoryGroup[] {
    const records = useQuery(fixedCostsQuery).data ?? EMPTY;
    const categories = useFixedCostCategories();
    // Once per mount: "running" is about today.
    const [today] = useState(() => toLocalIsoDate(new Date()));
    return useMemo(
        () => toCategoryGroups(records, categories, today),
        [records, categories, today],
    );
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

interface OptimisticContext {
    previous: FixedCostList;

    /**
     * The detail of the updated fixed cost, if one was updated.
     */
    previousDetail?: { id: string; record: FixedCostRecord | undefined };
}

/**
 * Optimistic mutation helpers: update the list (and the detail of an
 * updated fixed cost) right away, roll back with a toast on error and
 * refetch once settled. Fixed costs are online-only, so nothing is queued.
 * `isShownInline` skips the toast for errors the caller shows itself.
 */
function useOptimisticFixedCosts(
    errorMessage: () => string,
    isShownInline: (error: Error) => boolean = () => false,
) {
    const queryClient = useQueryClient();

    async function apply(
        update: (list: FixedCostRecord[]) => FixedCostRecord[],
    ): Promise<OptimisticContext> {
        await queryClient.cancelQueries({ queryKey: ["fixed-costs"] });
        const previous = queryClient.getQueryData<FixedCostRecord[]>(
            fixedCostsQuery.queryKey,
        );
        queryClient.setQueryData<FixedCostRecord[]>(
            fixedCostsQuery.queryKey,
            (list) => list && update(list),
        );
        return { previous };
    }

    return {
        apply,
        async applyToDetail(
            id: string,
            patch: FixedCostPatch,
        ): Promise<OptimisticContext> {
            const context = await apply((list) =>
                list
                    .map((record) =>
                        record.id === id ? { ...record, ...patch } : record,
                    )
                    .sort(byName),
            );
            const { queryKey } = fixedCostQuery(id);
            const record = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(
                queryKey,
                (detail) => detail && { ...detail, ...patch },
            );
            return { ...context, previousDetail: { id, record } };
        },
        rollback(error: Error, context: OptimisticContext | undefined) {
            if (context) {
                queryClient.setQueryData(
                    fixedCostsQuery.queryKey,
                    context.previous,
                );
                if (context.previousDetail) {
                    queryClient.setQueryData(
                        fixedCostQuery(context.previousDetail.id).queryKey,
                        context.previousDetail.record,
                    );
                }
            }
            if (!isShownInline(error)) {
                toast.error(errorMessage());
            }
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
        onError: (error, _input, context) =>
            optimistic.rollback(error, context),
        onSettled: optimistic.settle,
    });
}

/**
 * `isShownInline` skips the error toast for errors the caller shows itself.
 */
export function useUpdateFixedCost(isShownInline?: (error: Error) => boolean) {
    const optimistic = useOptimisticFixedCosts(
        m.fixed_cost_update_failed,
        isShownInline,
    );
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: FixedCostPatch }) =>
            apiFetch<FixedCostRecord>(`/fixed-costs/${id}`, {
                method: "PATCH",
                body: patch,
            }),
        onMutate: ({ id, patch }) => optimistic.applyToDetail(id, patch),
        onError: (error, _variables, context) =>
            optimistic.rollback(error, context),
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
        onError: (error, _id, context) => optimistic.rollback(error, context),
        onSettled: optimistic.settle,
    });
}

/**
 * Changes a fixed cost category's hue, shown right away; online-only.
 */
export function useUpdateFixedCostCategory() {
    const queryClient = useQueryClient();
    const { queryKey } = fixedCostCategoriesQuery;
    return useMutation({
        mutationFn: ({
            id,
            update,
        }: {
            id: string;
            update: UpdateFixedCostCategory;
        }) =>
            apiFetch<FixedCostCategory>(`/fixed-cost-categories/${id}`, {
                method: "PATCH",
                body: update,
            }),
        onMutate: async ({ id, update }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, (categories) =>
                categories?.map((category) =>
                    category.id === id ? { ...category, ...update } : category,
                ),
            );
            return { previous };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(queryKey, context?.previous);
            toast.error(m.fixed_cost_category_color_failed());
        },
        onSettled: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey }),
                queryClient.invalidateQueries({ queryKey: ["fixed-costs"] }),
                queryClient.invalidateQueries({ queryKey: ["insights"] }),
            ]),
    });
}
