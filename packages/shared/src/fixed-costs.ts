import { z } from "zod";

export const fixedCostCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
});
export type FixedCostCategory = z.infer<typeof fixedCostCategorySchema>;

export const fixedCostIntervalSchema = z.enum([
    "monthly",
    "quarterly",
    "yearly",
]);
export type FixedCostInterval = z.infer<typeof fixedCostIntervalSchema>;

/**
 * Calendar date as `YYYY-MM-DD`.
 */
const isoDate = z.iso.date();

export const fixedCostSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    amount: z.number().nonnegative(),
    currency: z.string().length(3),
    interval: fixedCostIntervalSchema,
    categoryId: z.string().min(1),
    active: z.boolean(),
    startDate: isoDate,
    endDate: isoDate.nullable(),
});
export type FixedCost = z.infer<typeof fixedCostSchema>;

export const fixedCostInputSchema = fixedCostSchema.omit({ id: true });
export type FixedCostInput = z.infer<typeof fixedCostInputSchema>;

export const fixedCostPatchSchema = fixedCostInputSchema.partial();
export type FixedCostPatch = z.infer<typeof fixedCostPatchSchema>;

const MONTHS_PER_INTERVAL = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
} as const satisfies Record<FixedCostInterval, number>;

/**
 * The amount spread evenly over the months of its interval, unrounded.
 */
export function getMonthlyAmount(fixedCost: FixedCost): number {
    return fixedCost.amount / MONTHS_PER_INTERVAL[fixedCost.interval];
}

/**
 * Twelve monthly amounts, unrounded.
 */
export function getYearlyAmount(fixedCost: FixedCost): number {
    return getMonthlyAmount(fixedCost) * 12;
}

/**
 * Whether the fixed cost is active and `day` (`YYYY-MM-DD`) is in its range.
 */
export function isRunningOn(fixedCost: FixedCost, day: string): boolean {
    return (
        fixedCost.active &&
        fixedCost.startDate <= day &&
        (fixedCost.endDate === null || fixedCost.endDate >= day)
    );
}

/**
 * The calendar day of `instant` (Unix ms) in `timeZone`, as `YYYY-MM-DD`.
 */
export function toIsoDate(instant: number, timeZone: string): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(instant);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((p) => p.type === type)?.value;
    return `${part("year")}-${part("month")}-${part("day")}`;
}
