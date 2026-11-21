import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type {
    CategoryInput,
    CategoryPatch,
    DefaultCategory,
} from "@finances/shared";
import { apiFetch } from "#/api/api-client.ts";

const EMPTY: never[] = [];

const defaultCategoriesQuery = queryOptions({
    queryKey: ["default-categories"],
    queryFn: () => apiFetch<DefaultCategory[]>("/admin/default-categories"),
});

export function useDefaultCategories(): DefaultCategory[] {
    return useQuery(defaultCategoriesQuery).data ?? EMPTY;
}

// Editing default categories is online-only: nothing is queued, and callers
// await the mutations to show errors (such as a taken name) in place. Users'
// own categories never change with them.

function useInvalidateDefaultCategories() {
    const queryClient = useQueryClient();
    return () =>
        queryClient.invalidateQueries({
            queryKey: defaultCategoriesQuery.queryKey,
        });
}

export function useCreateDefaultCategory() {
    const invalidate = useInvalidateDefaultCategories();
    return useMutation({
        mutationFn: (input: CategoryInput) =>
            apiFetch<DefaultCategory>("/admin/default-categories", {
                method: "POST",
                body: input,
            }),
        onSettled: invalidate,
    });
}

export function useUpdateDefaultCategory() {
    const invalidate = useInvalidateDefaultCategories();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: CategoryPatch }) =>
            apiFetch<DefaultCategory>(`/admin/default-categories/${id}`, {
                method: "PATCH",
                body: patch,
            }),
        onSettled: invalidate,
    });
}

export function useDeleteDefaultCategory() {
    const invalidate = useInvalidateDefaultCategories();
    return useMutation({
        mutationFn: (id: string) =>
            apiFetch<void>(`/admin/default-categories/${id}`, {
                method: "DELETE",
            }),
        onSettled: invalidate,
    });
}
