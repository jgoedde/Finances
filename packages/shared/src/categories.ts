import { z } from "zod";
import { type TransactionKind, transactionKindSchema } from "./transactions.ts";

const categoryBaseSchema = z.object({
    id: z.string(),
    color: z.string(),
    iconName: z.string(),

    /**
     * Fixed when the category is created: expenses only get expense
     * categories, incomes only income categories.
     */
    kind: transactionKindSchema,
});

/**
 * A fallback category has no name; the client shows it as "Sonstiges" /
 * "Other".
 */
export const categorySchema = z.discriminatedUnion("fallback", [
    categoryBaseSchema.extend({
        fallback: z.literal(false),
        name: z.string(),
    }),
    categoryBaseSchema.extend({ fallback: z.literal(true), name: z.null() }),
]);
export type Category = z.infer<typeof categorySchema>;

/**
 * The fallback category of each kind, which every user always has.
 */
export const FALLBACK_CATEGORIES = {
    expense: {
        id: "fallback-expense",
        color: "#7c7c7c",
        iconName: "circle-ellipsis",
        kind: "expense",
        fallback: true,
        name: null,
    },
    income: {
        id: "fallback-income",
        color: "#3f8f6b",
        iconName: "hand-coins",
        kind: "income",
        fallback: true,
        name: null,
    },
} as const satisfies Record<TransactionKind, Category>;

const categoryNameSchema = z.string().trim().min(1).max(40);

/**
 * `#rrggbb`. The client offers a palette, but any color stays valid.
 */
const categoryColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

/**
 * A Lucide icon name, e.g. `shopping-basket`.
 */
const categoryIconNameSchema = z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .max(64);

export const categoryInputSchema = z.object({
    kind: transactionKindSchema,
    name: categoryNameSchema,
    color: categoryColorSchema,
    iconName: categoryIconNameSchema,
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

/**
 * A fallback category only takes `color` and `iconName`.
 */
export const categoryPatchSchema = categoryInputSchema
    .omit({ kind: true })
    .partial()
    .refine((patch) => Object.values(patch).some((v) => v !== undefined));
export type CategoryPatch = z.infer<typeof categoryPatchSchema>;

export const deleteCategoryQuerySchema = z.object({
    /**
     * Where the category's transactions move; needed only if it has any.
     */
    moveTo: z.string().min(1).optional(),
});

export interface CategoryUsage {
    /**
     * How many transactions are in the category.
     */
    transactions: number;
}

/**
 * A category an admin maintains for the instance; every new user starts with
 * a copy of each (ADR 0007). Never a fallback category.
 */
export const defaultCategorySchema = categoryInputSchema.extend({
    id: z.string(),
});
export type DefaultCategory = z.infer<typeof defaultCategorySchema>;
