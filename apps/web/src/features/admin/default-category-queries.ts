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
import { api, unwrap } from "#/api/api-client.ts";

const EMPTY: never[] = [];

const defaultCategoriesQuery = queryOptions({
    queryKey: ["default-categories"],
    queryFn: () => unwrap(api.admin["default-categories"].$get()),
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
            unwrap(api.admin["default-categories"].$post({ json: input })),
        onSettled: invalidate,
    });
}

export function useUpdateDefaultCategory() {
    const invalidate = useInvalidateDefaultCategories();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: CategoryPatch }) =>
            unwrap(
                api.admin["default-categories"][":id"].$patch({
                    param: { id },
                    json: patch,
                }),
            ),
        onSettled: invalidate,
    });
}

export function useDeleteDefaultCategory() {
    const invalidate = useInvalidateDefaultCategories();
    return useMutation({
        mutationFn: (id: string) =>
            unwrap(
                api.admin["default-categories"][":id"].$delete({
                    param: { id },
                }),
            ),
        onSettled: invalidate,
    });
}
