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
    /** Unix timestamp in milliseconds. */
    date: z.number().int(),
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    kind: transactionKindSchema,
    /** Always non-negative; `kind` decides the direction. */
    amount: z.number().nonnegative().finite(),
    currency: z.string().length(3),
    categoryId: z.string().min(1),
    /** One-off large transaction, excluded from insights. */
    exceptional: z.boolean(),
});
export type TransactionInput = z.infer<typeof transactionInputSchema>;

export const transactionSchema = transactionInputSchema.extend({
    id: transactionIdSchema,
});
export type Transaction = z.infer<typeof transactionSchema>;

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
export type TransactionListQuery = z.input<typeof transactionListQuerySchema>;
