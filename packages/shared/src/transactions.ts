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

export const transactionSchema = z.object({
    id: transactionIdSchema,

    /**
     * Unix timestamp in milliseconds.
     */
    date: z.number().int(),
    counterparty: z.string().trim().min(1).max(200),
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
export type Transaction = z.infer<typeof transactionSchema>;

export const transactionInputSchema = transactionSchema.omit({ id: true });
export type TransactionInput = z.infer<typeof transactionInputSchema>;

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
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;

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
     * Matched against counterparty and description (case-insensitive for ASCII).
     */
    q: z.string().max(200).optional(),

    /**
     * Only transactions before this Unix timestamp in milliseconds.
     */
    olderThan: z.coerce.number<number>().int().optional(),
    cursor: searchCursorSchema.optional(),
    limit: z.coerce.number<number>().int().min(1).max(100).default(50),
});

/**
 * What the client sends: the cursor as a string and the limit optional.
 */
export type TransactionSearchQuery = z.input<
    typeof transactionSearchQuerySchema
>;

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

/**
 * What remains of `total` for the main transaction once the parts are taken
 * out, in whole cents so `50 - 12.3 - 0.1` is `37.6`. Zero or below means the
 * parts cover the total.
 */
export function splitRemainder(total: number, partAmounts: number[]): number {
    const cents = partAmounts.reduce(
        (rest, amount) => rest - Math.round(amount * 100),
        Math.round(total * 100),
    );
    return cents / 100;
}
