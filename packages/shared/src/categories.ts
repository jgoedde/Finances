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
