import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import type { FixedCostCategory } from "@/persistence/types.ts";
import { fixedCostCategoryRepository } from "@/persistence/repositories/fixed-cost-category-repository.ts";

export function useFixedCostCategories(): FixedCostCategory[] {
    return useTableSubscription(
        () => fixedCostCategoryRepository.getAll(),
        [],
        "fixedCostCategories:changed",
    );
}
