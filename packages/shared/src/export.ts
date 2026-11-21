import { z } from "zod";
import { categorySchema, FALLBACK_CATEGORIES } from "./categories.ts";
import {
    fixedCostCategorySchema,
    fixedCostSchema,
    initialHue,
} from "./fixed-costs.ts";
import { transactionKindSchema, transactionSchema } from "./transactions.ts";

/**
 * A user's complete data, as downloaded by the export. Bump `version` on
 * breaking changes and keep importing old ones (see `dataImportSchema`).
 */
const dataExportSchema = z.object({
    format: z.literal("finances-export"),
    version: z.literal(7),
    exportedAt: z.iso.datetime(),
    categories: z.array(categorySchema),
    fixedCostCategories: z.array(fixedCostCategorySchema),
    fixedCosts: z.array(fixedCostSchema),
    transactions: z.array(transactionSchema),
});
export type DataExport = z.infer<typeof dataExportSchema>;

/**
 * Version 6: transactions had no `mainExpenseId` (no attached expenses).
 */
const dataExportV6Schema = dataExportSchema.extend({
    version: z.literal(6),
    transactions: z.array(transactionSchema.omit({ mainExpenseId: true })),
});
type DataExportV6 = z.infer<typeof dataExportV6Schema>;

/**
 * Version 5: categories had no `kind` and no fallback categories existed.
 */
const dataExportV5Schema = dataExportV6Schema.extend({
    version: z.literal(5),
    categories: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
            iconName: z.string(),
        }),
    ),
});
type DataExportV5 = z.infer<typeof dataExportV5Schema>;

/**
 * Version 4: fixed cost categories had no `hue`.
 */
const dataExportV4Schema = dataExportV5Schema.extend({
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
    transactions: z.array(
        transactionSchema.omit({ mainExpenseId: true, location: true }),
    ),
});

/**
 * No expense is attached to another one.
 */
function fromV6(data: DataExportV6): DataExport {
    return {
        ...data,
        version: 7,
        transactions: data.transactions.map((transaction) => ({
            ...transaction,
            mainExpenseId: null,
        })),
    };
}

/**
 * Like the migration `0006-category-kinds`: every category becomes an
 * expense category, both fallback categories are added and all incomes move
 * onto the income fallback category.
 */
function fromV5(data: DataExportV5): DataExportV6 {
    return {
        ...data,
        version: 6,
        categories: [
            ...data.categories.map((category) => ({
                ...category,
                kind: "expense" as const,
                fallback: false as const,
            })),
            FALLBACK_CATEGORIES.expense,
            FALLBACK_CATEGORIES.income,
        ],
        transactions: data.transactions.map((transaction) =>
            transaction.kind === "income"
                ? {
                      ...transaction,
                      categoryId: FALLBACK_CATEGORIES.income.id,
                  }
                : transaction,
        ),
    };
}

function fromV4(data: DataExportV4): DataExportV5 {
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
 * Whether the export has exactly one fallback category of each kind.
 */
function hasOneFallbackPerKind(data: DataExport): boolean {
    return transactionKindSchema.options.every(
        (kind) =>
            data.categories.filter((c) => c.fallback && c.kind === kind)
                .length === 1,
    );
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
        dataExportV5Schema,
        dataExportV6Schema,
        dataExportSchema,
    ])
    .transform((data): DataExport => {
        switch (data.version) {
            case 2:
                return fromV6(
                    fromV5(
                        fromV4(
                            fromV3({
                                ...data,
                                version: 3,
                                transactions: data.transactions.map(
                                    (transaction) => ({
                                        ...transaction,
                                        location: null,
                                    }),
                                ),
                            }),
                        ),
                    ),
                );
            case 3:
                return fromV6(fromV5(fromV4(fromV3(data))));
            case 4:
                return fromV6(fromV5(fromV4(data)));
            case 5:
                return fromV6(fromV5(data));
            case 6:
                return fromV6(data);
            case 7:
                return data;
            default:
                throw new Error(
                    `unreachable error - type ${String(data satisfies never)}`,
                );
        }
    })
    .refine(hasOneFallbackPerKind, {
        message: "Needs exactly one fallback category of each kind",
        path: ["categories"],
    });

export interface ImportResult {
    categories: number;
    fixedCosts: number;
    transactions: number;
}
