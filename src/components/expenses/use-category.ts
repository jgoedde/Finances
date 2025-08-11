import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { categoriesRepository } from "@/persistence/repository.ts";
import type { Category } from "@/persistence/types.ts";

export function useCategoryById(id: string): Category | undefined {
    return useTableSubscription(
        () => categoriesRepository.findById(id),
        [id],
        "categories:changed",
    );
}
