import type { Category } from "@/persistence/types.ts";
import { rowsFromResult } from "@/persistence/row-mapper.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const categoryRepository = {
    getAll(): Category[] {
        const query = `            
            SELECT *
            FROM categories
            ORDER BY name`;

        return rowsFromResult<Category>(PersistentDatabase.get().exec(query));
    },
};
