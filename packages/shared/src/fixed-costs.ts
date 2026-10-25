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

/**
 * A new amount of a fixed cost from `date` on.
 */
export const priceChangeSchema = z.object({
    date: isoDate,
    amount: z.number().nonnegative(),
});
export type PriceChange = z.infer<typeof priceChangeSchema>;

/**
 * At most one price change per day.
 */
const priceChangesSchema = z
    .array(priceChangeSchema)
    .refine(
        (changes) =>
            new Set(changes.map((change) => change.date)).size ===
            changes.length,
        { message: "Duplicate price change date" },
    );

export const fixedCostSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),

    /**
     * The amount from the start date until the first price change.
     */
    initialAmount: z.number().nonnegative(),

    /**
     * Each after the start date and on or before the end date (checked by
     * the API). Served sorted by date, ascending.
     */
    priceChanges: priceChangesSchema,
    currency: z.string().length(3),
    interval: fixedCostIntervalSchema,
    categoryId: z.string().min(1),
    active: z.boolean(),
    startDate: isoDate,
    endDate: isoDate.nullable(),
});
export type FixedCost = z.infer<typeof fixedCostSchema>;

const fixedCostFieldsSchema = fixedCostSchema.omit({ id: true });

export const fixedCostInputSchema = fixedCostFieldsSchema.extend({
    priceChanges: priceChangesSchema.default([]),
});
export type FixedCostInput = z.infer<typeof fixedCostInputSchema>;

/**
 * `priceChanges`, when given, replaces all of them.
 */
export const fixedCostPatchSchema = fixedCostFieldsSchema.partial();
export type FixedCostPatch = z.infer<typeof fixedCostPatchSchema>;

const MONTHS_PER_INTERVAL = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
} as const satisfies Record<FixedCostInterval, number>;

/**
 * What the fixed cost charges per interval on `day` (`YYYY-MM-DD`): the
 * amount of its latest price change on or before that day, else its initial
 * amount.
 */
export function getAmountOn(
    fixedCost: Pick<FixedCost, "initialAmount" | "priceChanges">,
    day: string,
): number {
    let amount = fixedCost.initialAmount;
    for (const change of fixedCost.priceChanges) {
        if (change.date > day) {
            break;
        }
        amount = change.amount;
    }
    return amount;
}

/**
 * The amount on `day` (`YYYY-MM-DD`) spread evenly over the months of its
 * interval, unrounded.
 */
export function getMonthlyAmount(fixedCost: FixedCost, day: string): number {
    return (
        getAmountOn(fixedCost, day) / MONTHS_PER_INTERVAL[fixedCost.interval]
    );
}

/**
 * Twelve monthly amounts on `day` (`YYYY-MM-DD`), unrounded.
 */
export function getYearlyAmount(fixedCost: FixedCost, day: string): number {
    return getMonthlyAmount(fixedCost, day) * 12;
}

/**
 * `day` (`YYYY-MM-DD`), or the end date if the fixed cost ends before it:
 * the day whose amount counts for a period ending on `day`, so a price
 * change counts for the whole month it falls in.
 */
export function lastRunningDay(fixedCost: FixedCost, day: string): string {
    return fixedCost.endDate !== null && fixedCost.endDate < day
        ? fixedCost.endDate
        : day;
}

/**
 * Whether the fixed cost is active and `day` (`YYYY-MM-DD`) is in its range.
 */
export function isRunningOn(fixedCost: FixedCost, day: string): boolean {
    return isRunningBetween(fixedCost, day, day);
}

/**
 * Whether the fixed cost is running on at least one day from `from` to `to`
 * (`YYYY-MM-DD`, both included).
 */
export function isRunningBetween(
    fixedCost: FixedCost,
    from: string,
    to: string,
): boolean {
    return (
        fixedCost.active &&
        fixedCost.startDate <= to &&
        (fixedCost.endDate === null || fixedCost.endDate >= from)
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
