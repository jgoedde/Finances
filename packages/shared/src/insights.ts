import { z } from "zod";

function isTimeZone(timeZone: string): boolean {
    try {
        new Intl.DateTimeFormat("en-US", { timeZone });
        return true;
    } catch {
        return false;
    }
}

/**
 * The month and time zone an insight is about.
 */
export const monthInsightQuerySchema = z.object({
    /**
     * `YYYY-MM`.
     */
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),

    /**
     * IANA time zone that decides which month and day a transaction is on.
     */
    timeZone: z.string().refine(isTimeZone),
});
export type MonthInsightQuery = z.infer<typeof monthInsightQuerySchema>;

/**
 * A category's net spending in the month, next to its typical month.
 */
export interface CategoryOverview {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIconName: string;
    total: number;

    /**
     * `null` without complete months to compare with.
     */
    typical: number | null;
}

/**
 * A fixed cost category's fixed costs running in the month.
 */
export interface FixedCostCategoryOverview {
    categoryId: string;
    categoryName: string;
    categoryHue: number;

    /**
     * Monthly amount of its fixed costs running in the month.
     */
    total: number;

    /**
     * Largest monthly amount first.
     */
    fixedCosts: { id: string; name: string; total: number }[];
}

export interface MonthlyTotal {
    /**
     * `YYYY-MM`.
     */
    month: string;
    total: number;
}

/**
 * One month at a glance. Net spending, income and expenses include
 * exceptional transactions; pace, categories and the trend leave them out.
 */
export interface MonthOverview {
    netSpending: number;
    income: number;
    expenses: number;
    exceptional: { count: number; netSpending: number };
    pace: {
        /**
         * Compared up to this day of the month; `null` for the whole month.
         */
        day: number | null;
        netSpending: number;

        /**
         * Typical month up to `day`; `null` without complete months.
         */
        typical: number | null;
    };

    /**
     * Monthly amounts of the fixed costs running in the month.
     */
    fixedCosts: number;

    /**
     * The fixed costs running in the month by fixed cost category, largest
     * first.
     */
    fixedCostCategories: FixedCostCategoryOverview[];
    categories: CategoryOverview[];

    /**
     * Net spending of the twelve months ending with this one.
     */
    trend: MonthlyTotal[];
}
