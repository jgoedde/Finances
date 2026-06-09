import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import type { Category } from "@/persistence/types.ts";
import { categoryRepository } from "@/persistence/repositories/category-repository.ts";

export function useCategories(): Category[] {
    return useTableSubscription(
        () => categoryRepository.getAll(),
        [],
        "categories:changed",
    );
}
