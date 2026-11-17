import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type {
    Category,
    CategoryInput,
    CategoryPatch,
    CategoryUsage,
} from "@finances/shared";
import { apiFetch, toQueryString } from "#/api/api-client.ts";

const EMPTY: never[] = [];

// Not `staleTime: Infinity`: categories can change on another device.
const categoriesQuery = queryOptions({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/categories"),
});

export function useCategories(): Category[] {
    return useQuery(categoriesQuery).data ?? EMPTY;
}

/**
 * How many transactions deleting the category would move; `null` while
 * loading or when `id` is `null`.
 */
export function useCategoryUsage(id: string | null): CategoryUsage | null {
    return (
        useQuery({
            queryKey: ["categories", "usage", id],
            queryFn: () => apiFetch<CategoryUsage>(`/categories/${id}/usage`),
            enabled: id !== null,
            // Always the current count: it decides whether a target is asked.
            staleTime: 0,
            gcTime: 0,
        }).data ?? null
    );
}

// Editing categories is online-only: nothing is queued, and callers await
// the mutations to show errors (such as a taken name) in place.

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CategoryInput) =>
            apiFetch<Category>("/categories", { method: "POST", body: input }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: CategoryPatch }) =>
            apiFetch<Category>(`/categories/${id}`, {
                method: "PATCH",
                body: patch,
            }),
        onSettled: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["categories"] }),
                // Insights name and color categories.
                queryClient.invalidateQueries({ queryKey: ["insights"] }),
            ]),
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, moveTo }: { id: string; moveTo?: string }) =>
            apiFetch<void>(`/categories/${id}?${toQueryString({ moveTo })}`, {
                method: "DELETE",
            }),
        // Its transactions moved to another category.
        onSettled: () =>
            Promise.all(
                ["categories", "transactions", "insights"].map((key) =>
                    queryClient.invalidateQueries({ queryKey: [key] }),
                ),
            ),
    });
}
