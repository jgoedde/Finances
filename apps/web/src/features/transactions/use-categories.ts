import { useTableSubscription } from "@/persistence/use-table-subscription.ts";
import type { Category } from "@/persistence/types.ts";
import { categoryRepository } from "@/features/transactions/category-repository.ts";

export function useCategories(): Category[] {
    return useTableSubscription(
        () => categoryRepository.getAll(),
        [],
        "categories:changed",
    );
}
