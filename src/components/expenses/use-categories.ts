import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { categoriesRepository } from "@/persistence/repository.ts";
import type { Category } from "@/persistence/types.ts";

export function useCategories(): Category[] {
    return useTableSubscription(
        () => categoriesRepository.getAll(),
        [],
        "categories:changed",
    );
}
