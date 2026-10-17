import { z } from "zod";
import { type TransactionKind, transactionKindSchema } from "./transactions.ts";

export const spentQuerySchema = z.object({
    from: z.coerce.number().int(),
    to: z.coerce.number().int(),
    /** Omitted: net total (expenses minus income). */
    kind: transactionKindSchema.optional(),
});
export interface SpentQuery {
    from: number;
    to: number;
    kind?: TransactionKind;
}

export interface SpentTotal {
    total: number;
}

export interface DailyTotal {
    /** `YYYY-MM-DD` (UTC). */
    day: string;
    total: number;
}

export interface DailySpike {
    day: string;
    total: number;
    categoryName: string;
    categoryColor: string;
}

export interface CategorySpending {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIconName: string;
    total: number;
    expenseCount: number;
    averageExpense: number;
}

export interface MonthlyCategoryTotal {
    /** `YYYY-MM` (UTC). */
    month: string;
    categoryName: string;
    categoryIconName: string;
    total: number;
}

export interface MonthlyTotal {
    total: number;
}
