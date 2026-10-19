import { z } from "zod";
import { categorySchema } from "./categories.ts";
import { fixedCostCategorySchema, fixedCostSchema } from "./fixed-costs.ts";
import { transactionSchema } from "./transactions.ts";

/**
 * A user's complete data, as downloaded by the export. Bump `version` on
 * breaking changes and keep importing old ones (see `dataImportSchema`).
 */
const dataExportSchema = z.object({
    format: z.literal("finances-export"),
    version: z.literal(2),
    exportedAt: z.iso.datetime(),
    categories: z.array(categorySchema),
    fixedCostCategories: z.array(fixedCostCategorySchema),
    fixedCosts: z.array(fixedCostSchema),
    transactions: z.array(transactionSchema),
});
export type DataExport = z.infer<typeof dataExportSchema>;

/**
 * Version 1: transactions had a `name` instead of a `counterparty`.
 */
const dataExportV1Schema = dataExportSchema.extend({
    version: z.literal(1),
    transactions: z.array(
        transactionSchema
            .omit({ counterparty: true })
            .extend({ name: transactionSchema.shape.counterparty }),
    ),
});

/**
 * What the import accepts: an export of any version, upgraded to the current
 * one.
 */
export const dataImportSchema = z
    .discriminatedUnion("version", [dataExportV1Schema, dataExportSchema])
    .transform((data): DataExport => {
        switch (data.version) {
            case 1:
                return {
                    ...data,
                    version: 2,
                    transactions: data.transactions.map(
                        ({ name, ...transaction }) => ({
                            ...transaction,
                            counterparty: name,
                        }),
                    ),
                };
            case 2:
                return data;
            default:
                throw new Error(
                    `unreachable error - type ${String(data satisfies never)}`,
                );
        }
    });

export interface ImportResult {
    categories: number;
    fixedCosts: number;
    transactions: number;
}
