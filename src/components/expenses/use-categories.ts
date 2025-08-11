import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { categoriesRepo } from "@/persistence/repository.ts";
import type { Category } from "@/persistence/types.ts";
import { useEncryption } from "@/components/use-encryption.ts";

export function useCategories(): Category[] {
    const { key } = useEncryption();

    if (!key) {
        throw new Error("Unable to query categories without encryption key");
    }

    return useTableSubscription(
        () => categoriesRepo.getAll(key),
        [key],
        "categories:changed",
    );
}
