import { z } from "zod";
import { categorySchema } from "./categories.ts";
import {
    type FixedCost,
    fixedCostCategorySchema,
    fixedCostSchema,
    legacyFixedCostSchema,
} from "./fixed-costs.ts";
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
 * Version 3: fixed costs had one amount and interval and an `active` switch.
 */
const dataExportV3Schema = dataExportSchema.extend({
    version: z.literal(3),
    fixedCosts: z.array(legacyFixedCostSchema),
});

/**
 * Version 2: like version 3, and transactions had no `location`.
 */
const dataExportV2Schema = dataExportV3Schema.extend({
    version: z.literal(2),
    transactions: z.array(transactionSchema.omit({ location: true })),
});

/**
 * Version 3 fixed costs with their amount as the whole history. Inactive ones
 * end on the export's day at the latest.
 */
function upgradeFixedCosts({
    fixedCosts,
    exportedAt,
}: Pick<
    z.infer<typeof dataExportV3Schema>,
    "fixedCosts" | "exportedAt"
>): FixedCost[] {
    const exportedOn = exportedAt.slice(0, 10);
    return fixedCosts.map(({ amount, interval, active, ...fixedCost }) => ({
        ...fixedCost,
        endDate:
            active ||
            (fixedCost.endDate !== null && fixedCost.endDate < exportedOn)
                ? fixedCost.endDate
                : exportedOn,
        amounts: [{ validFrom: fixedCost.startDate, amount, interval }],
    }));
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
                return {
                    ...data,
                    version: 4,
                    fixedCosts: upgradeFixedCosts(data),
                    transactions: data.transactions.map((transaction) => ({
                        ...transaction,
                        location: null,
                    })),
                };
            case 3:
                return {
                    ...data,
                    version: 4,
                    fixedCosts: upgradeFixedCosts(data),
                };
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
