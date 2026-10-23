import _ from "lodash";
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

export const fixedCostAmountSchema = z.object({
    /**
     * First day the amount and interval apply.
     */
    validFrom: isoDate,
    amount: z.number().nonnegative(),
    interval: fixedCostIntervalSchema,
});
export type FixedCostAmount = z.infer<typeof fixedCostAmountSchema>;

const fixedCostObject = z.object({
    id: z.string(),
    name: z.string().trim().min(1).max(200),
    description: z.string().max(2000).nullable(),
    currency: z.string().length(3),
    categoryId: z.string().min(1),
    startDate: isoDate,
    endDate: isoDate.nullable(),

    /**
     * The amount history, ascending by `validFrom`; the first entry is valid
     * from `startDate`.
     */
    amounts: z
        .array(fixedCostAmountSchema)
        .min(1)
        .refine(
            (amounts) =>
                amounts.every(
                    (it, i) =>
                        i === 0 || amounts[i - 1]!.validFrom < it.validFrom,
                ),
            "Amounts must be ascending by validFrom",
        ),
});
export type FixedCost = z.infer<typeof fixedCostObject>;

const startsOnStartDate = {
    check: (it: Partial<Pick<FixedCost, "amounts" | "startDate">>) =>
        it.amounts?.[0]?.validFrom === it.startDate,
    message: "The first amount must be valid from the start date",
};

export const fixedCostSchema = fixedCostObject.refine(
    startsOnStartDate.check,
    startsOnStartDate.message,
);

/**
 * Fixed costs before the amount history (export version 3 and older): one
 * amount and interval, and an `active` switch.
 */
export const legacyFixedCostSchema = fixedCostObject
    .omit({ amounts: true })
    .extend({
        amount: z.number().nonnegative(),
        interval: fixedCostIntervalSchema,
        active: z.boolean(),
    });

export const fixedCostInputSchema = fixedCostObject
    .omit({ id: true })
    .refine(startsOnStartDate.check, startsOnStartDate.message);
export type FixedCostInput = z.infer<typeof fixedCostInputSchema>;

/**
 * `amounts` and `startDate` change together, so the history keeps starting
 * on the start date.
 */
export const fixedCostPatchSchema = fixedCostObject
    .omit({ id: true })
    .partial()
    .refine(
        (patch) =>
            patch.amounts === undefined && patch.startDate === undefined
                ? true
                : startsOnStartDate.check(patch),
        startsOnStartDate.message,
    );
export type FixedCostPatch = z.infer<typeof fixedCostPatchSchema>;

const MONTHS_PER_INTERVAL = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
} as const satisfies Record<FixedCostInterval, number>;

/**
 * The amount history's entry valid on `day` (`YYYY-MM-DD`); the first one
 * before the start date.
 */
export function currentAmount(
    fixedCost: Pick<FixedCost, "amounts">,
    day: string,
): FixedCostAmount {
    const { amounts } = fixedCost;
    return _.findLast(amounts, (it) => it.validFrom <= day) ?? amounts[0]!;
}

/**
 * The amount valid on `day` (`YYYY-MM-DD`) spread evenly over the months of
 * its interval, unrounded.
 */
export function getMonthlyAmount(
    fixedCost: Pick<FixedCost, "amounts">,
    day: string,
): number {
    const { amount, interval } = currentAmount(fixedCost, day);
    return amount / MONTHS_PER_INTERVAL[interval];
}

/**
 * Twelve monthly amounts as of `day` (`YYYY-MM-DD`), unrounded.
 */
export function getYearlyAmount(
    fixedCost: Pick<FixedCost, "amounts">,
    day: string,
): number {
    return getMonthlyAmount(fixedCost, day) * 12;
}

/**
 * The amount history after changing the amount and interval from
 * `change.validFrom` on. A change from the last entry's day or before
 * corrects that entry instead of adding one.
 */
export function changeAmount(
    amounts: FixedCostAmount[],
    change: FixedCostAmount,
): FixedCostAmount[] {
    const last = _.last(amounts);
    if (last === undefined || change.validFrom > last.validFrom) {
        return [...amounts, change];
    }
    return [...amounts.slice(0, -1), { ...change, validFrom: last.validFrom }];
}

/**
 * The amount history for a new start date (`YYYY-MM-DD`): it starts with the
 * entry valid on that day and drops the ones before.
 */
export function rebaseAmounts(
    amounts: FixedCostAmount[],
    startDate: string,
): FixedCostAmount[] {
    const first = Math.max(
        0,
        _.findLastIndex(amounts, (it) => it.validFrom <= startDate),
    );
    return amounts
        .slice(first)
        .map((it, i) => (i === 0 ? { ...it, validFrom: startDate } : it));
}

/**
 * Whether `day` (`YYYY-MM-DD`) is in the fixed cost's range.
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
