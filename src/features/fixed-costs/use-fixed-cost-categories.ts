import { useTableSubscription } from "@/persistence/use-table-subscription.ts";
import type { FixedCostCategory } from "@/persistence/types.ts";
import { fixedCostCategoryRepository } from "@/features/fixed-costs/fixed-cost-category-repository.ts";

export function useFixedCostCategories(): FixedCostCategory[] {
    return useTableSubscription(
        () => fixedCostCategoryRepository.getAll(),
        [],
        "fixedCostCategories:changed",
    );
}
