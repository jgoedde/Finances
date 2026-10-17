import type { FixedCostCategory } from "@/persistence/types.ts";
import { rowsFromResult } from "@/persistence/row-mapper.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const fixedCostCategoryRepository = {
    getAll(): FixedCostCategory[] {
        const query = `            
            SELECT c.*
            FROM fixed_cost_categories c
            ORDER BY name`;

        return rowsFromResult<FixedCostCategory>(
            PersistentDatabase.get().exec(query),
        );
    },
};
