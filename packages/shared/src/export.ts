import { z } from "zod";
import { categorySchema } from "./categories.ts";
import {
    fixedCostCategorySchema,
    fixedCostSchema,
    initialHue,
} from "./fixed-costs.ts";
import { transactionSchema } from "./transactions.ts";

/**
 * A user's complete data, as downloaded by the export. Bump `version` on
 * breaking changes and keep importing old ones (see `dataImportSchema`).
 */
const dataExportSchema = z.object({
    format: z.literal("finances-export"),
    version: z.literal(5),
    exportedAt: z.iso.datetime(),
    categories: z.array(categorySchema),
    fixedCostCategories: z.array(fixedCostCategorySchema),
    fixedCosts: z.array(fixedCostSchema),
    transactions: z.array(transactionSchema),
});
export type DataExport = z.infer<typeof dataExportSchema>;

/**
 * Version 4: fixed cost categories had no `hue`.
 */
const dataExportV4Schema = dataExportSchema.extend({
    version: z.literal(4),
    fixedCostCategories: z.array(fixedCostCategorySchema.omit({ hue: true })),
});
type DataExportV4 = z.infer<typeof dataExportV4Schema>;

/**
 * Version 3: fixed costs had a single `amount` and no price changes.
 */
const dataExportV3Schema = dataExportV4Schema.extend({
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

function fromV4(data: DataExportV4): DataExport {
    return {
        ...data,
        version: 5,
        fixedCostCategories: data.fixedCostCategories.map(
            (category, index) => ({
                ...category,
                hue: initialHue(category.id, index),
            }),
        ),
    };
}

function fromV3(data: DataExportV3): DataExportV4 {
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
        dataExportV4Schema,
        dataExportSchema,
    ])
    .transform((data): DataExport => {
        switch (data.version) {
            case 2:
                return fromV4(
                    fromV3({
                        ...data,
                        version: 3,
                        transactions: data.transactions.map((transaction) => ({
                            ...transaction,
                            location: null,
                        })),
                    }),
                );
            case 3:
                return fromV4(fromV3(data));
            case 4:
                return fromV4(data);
            case 5:
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
