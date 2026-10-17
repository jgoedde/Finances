import { z } from "zod";
import { categorySchema } from "./categories.ts";
import { fixedCostCategorySchema, fixedCostSchema } from "./fixed-costs.ts";
import { transactionSchema } from "./transactions.ts";

/**
 * A user's complete data, as downloaded by the export and accepted by the
 * import. Bump `version` on breaking changes and keep importing old ones.
 */
export const dataExportSchema = z.object({
    format: z.literal("finances-export"),
    version: z.literal(1),
    exportedAt: z.iso.datetime(),
    categories: z.array(categorySchema),
    fixedCostCategories: z.array(fixedCostCategorySchema),
    fixedCosts: z.array(fixedCostSchema),
    transactions: z.array(transactionSchema),
});
export type DataExport = z.infer<typeof dataExportSchema>;

export interface ImportResult {
    categories: number;
    fixedCosts: number;
    transactions: number;
}
