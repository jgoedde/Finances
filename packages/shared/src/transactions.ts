import { z } from "zod";

export const transactionKindSchema = z.enum(["expense", "income"]);
export type TransactionKind = z.infer<typeof transactionKindSchema>;

/**
 * Client-generated transaction ids (nanoid). Kept permissive so imported
 * legacy ids stay valid.
 */
export const transactionIdSchema = z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/);

export const transactionInputSchema = z.object({
    /**
     * Unix timestamp in milliseconds.
     */
    date: z.number().int(),
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    kind: transactionKindSchema,
    /**
     * Always non-negative; `kind` decides the direction.
     */
    amount: z.number().nonnegative(),
    currency: z.string().length(3),
    categoryId: z.string().min(1),
    /**
     * One-off large transaction, excluded from insights.
     */
    exceptional: z.boolean(),
});
export type TransactionInput = z.infer<typeof transactionInputSchema>;

export const transactionSchema = transactionInputSchema.extend({
    id: transactionIdSchema,
});
export type Transaction = z.infer<typeof transactionSchema>;

/**
 * The transaction's share of net spending: expenses add, incomes subtract.
 */
export function netSpending(
    transaction: Pick<Transaction, "kind" | "amount">,
): number {
    return transaction.kind === "expense"
        ? transaction.amount
        : -transaction.amount;
}

const booleanQuery = z
    .enum(["true", "false"])
    .transform((value) => value === "true");

export const transactionListQuerySchema = z.object({
    from: z.coerce.number().int(),
    to: z.coerce.number().int(),
    categoryId: z.string().min(1).optional(),
    kind: transactionKindSchema.optional(),
    excludeExceptional: booleanQuery.optional(),
});
export interface TransactionListQuery {
    from: number;
    to: number;
    categoryId?: string;
    kind?: TransactionKind;
    excludeExceptional?: boolean;
}

/**
 * Whether the transaction is part of the list the query asks for.
 */
export function matchesListQuery(
    transaction: Transaction,
    query: TransactionListQuery,
): boolean {
    return (
        transaction.date >= query.from &&
        transaction.date <= query.to &&
        (query.categoryId === undefined ||
            transaction.categoryId === query.categoryId) &&
        (query.kind === undefined || transaction.kind === query.kind) &&
        (!query.excludeExceptional || !transaction.exceptional)
    );
}

/**
 * Position after the last result of a page: `<date>:<id>`.
 */
const searchCursorSchema = z
    .string()
    .regex(/^-?\d+:[A-Za-z0-9_-]+$/)
    .transform((value) => {
        const separator = value.indexOf(":");
        return {
            date: Number(value.slice(0, separator)),
            id: value.slice(separator + 1),
        };
    });

export const transactionSearchQuerySchema = z.object({
    /**
     * Matched against name and description (case-insensitive for ASCII).
     */
    q: z.string().max(200).optional(),
    /**
     * Only transactions before this Unix timestamp in milliseconds.
     */
    olderThan: z.coerce.number().int().optional(),
    cursor: searchCursorSchema.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
});
export interface TransactionSearchQuery {
    q?: string;
    olderThan?: number;
    cursor?: string;
    limit?: number;
}

/**
 * One page of search results, newest first.
 */
export interface TransactionSearchPage {
    items: Transaction[];
    /**
     * `null` on the last page.
     */
    nextCursor: string | null;
}
