import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { categoriesRepo } from "@/persistence/repository.ts";
import type { Category } from "@/persistence/types.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useCategoryById(id: string): Category | undefined {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query category without encryption key");
    }

    return useTableSubscription(
        () => categoriesRepo.findById(id, key),
        [id, key],
        "categories:changed",
    );
}
