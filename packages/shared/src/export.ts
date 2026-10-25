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
    version: z.literal(4),
    exportedAt: z.iso.datetime(),
    categories: z.array(categorySchema),
    fixedCostCategories: z.array(fixedCostCategorySchema),
    fixedCosts: z.array(fixedCostSchema),
    transactions: z.array(transactionSchema),
});
export type DataExport = z.infer<typeof dataExportSchema>;

/**
 * Version 3: fixed costs had a single `amount` and no price changes.
 */
const dataExportV3Schema = dataExportSchema.extend({
    version: z.literal(3),
    fixedCosts: z.array(
        fixedCostSchema
            .omit({ initialAmount: true, priceChanges: true })
            .extend({ amount: z.number().nonnegative() }),
    ),
});
type DataExportV3 = z.infer<typeof dataExportV3Schema>;

/**
 * Version 2: transactions had no `location` either.
 */
const dataExportV2Schema = dataExportV3Schema.extend({
    version: z.literal(2),
    transactions: z.array(transactionSchema.omit({ location: true })),
});

function fromV3(data: DataExportV3): DataExport {
    return {
        ...data,
        version: 4,
        fixedCosts: data.fixedCosts.map(({ amount, ...fixedCost }) => ({
            ...fixedCost,
            initialAmount: amount,
            priceChanges: [],
        })),
    };
}

/**
 * What the import accepts: an export of version 2 or later, upgraded to the
 * current one.
 */
export const dataImportSchema = z
    .discriminatedUnion("version", [
        dataExportV2Schema,
        dataExportV3Schema,
        dataExportSchema,
    ])
    .transform((data): DataExport => {
        switch (data.version) {
            case 2:
                return fromV3({
                    ...data,
                    version: 3,
                    transactions: data.transactions.map((transaction) => ({
                        ...transaction,
                        location: null,
                    })),
                });
            case 3:
                return fromV3(data);
            case 4:
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
