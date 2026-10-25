import { z } from "zod";
import { lastDayOf, shiftMonth } from "./calendar.ts";

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
 * One amount of a fixed cost's price history.
 */
export interface PriceHistoryEntry {
    /**
     * From when the amount applies (`YYYY-MM-DD`): the start date or a
     * price change's date.
     */
    date: string;
    amount: number;

    /**
     * Ratio of the change against the previous amount (`0.25` is +25 %);
     * `null` for the start and after an amount of 0.
     */
    change: number | null;

    /**
     * `current` is the amount that applies on the given day.
     */
    status: "upcoming" | "current" | "past";

    /**
     * The initial amount from the start date.
     */
    isStart: boolean;
}

/**
 * The initial amount and every price change, newest first: upcoming, the
 * current one on `day` (`YYYY-MM-DD`), then past ones, the start last.
 */
export function getPriceHistory(
    fixedCost: Pick<FixedCost, "startDate" | "initialAmount" | "priceChanges">,
    day: string,
): PriceHistoryEntry[] {
    const amounts = [
        { date: fixedCost.startDate, amount: fixedCost.initialAmount },
        ...fixedCost.priceChanges,
    ];
    // Sorted by date, so the last one on or before `day` applies.
    const currentIndex = amounts.filter((it) => it.date <= day).length - 1;
    return amounts
        .map((it, index): PriceHistoryEntry => {
            const previous = amounts[index - 1]?.amount;
            return {
                date: it.date,
                amount: it.amount,
                change:
                    previous === undefined || previous === 0
                        ? null
                        : (it.amount - previous) / previous,
                status:
                    index === currentIndex
                        ? "current"
                        : index > currentIndex
                          ? "upcoming"
                          : "past",
                isStart: index === 0,
            };
        })
        .reverse();
}

/**
 * One day of a fixed cost's amount timeline.
 */
export interface AmountDay {
    /**
     * `YYYY-MM-DD`.
     */
    date: string;
    amount: number;

    /**
     * From when the amount applies: the start date or a price change's date.
     */
    since: string;

    /**
     * Its month has a price change after the 1st, so the day matters; else
     * the month is precise enough.
     */
    dayPrecision: boolean;

    /**
     * After `today`: by day when day-precise, else by month.
     */
    upcoming: boolean;
}

/**
 * The fixed cost's amount per interval on every day from its start to its
 * end date; without one, to a month after the latest of `today`
 * (`YYYY-MM-DD`), its start and its last price change.
 */
export function getAmountTimeline(
    fixedCost: Pick<
        FixedCost,
        "startDate" | "endDate" | "initialAmount" | "priceChanges"
    >,
    today: string,
): AmountDay[] {
    const latest = [
        today,
        fixedCost.startDate,
        ...fixedCost.priceChanges.map((it) => it.date),
    ]
        .sort()
        .pop()!;
    const end = fixedCost.endDate ?? addMonth(latest);
    const steps = [
        { date: fixedCost.startDate, amount: fixedCost.initialAmount },
        ...fixedCost.priceChanges,
    ];
    const preciseMonths = new Set(
        fixedCost.priceChanges
            .filter((it) => !it.date.endsWith("-01"))
            .map((it) => it.date.slice(0, 7)),
    );
    const days: AmountDay[] = [];
    for (let day = fixedCost.startDate; day <= end; day = nextDay(day)) {
        // Sorted by date, so the last one on or before `day` applies.
        const { date, amount } =
            steps.filter((it) => it.date <= day).pop() ?? steps[0]!;
        const dayPrecision = preciseMonths.has(day.slice(0, 7));
        days.push({
            date: day,
            amount,
            since: date,
            dayPrecision,
            upcoming: dayPrecision
                ? day > today
                : day.slice(0, 7) > today.slice(0, 7),
        });
    }
    return days;
}

/**
 * `day` a month later, clamped to the end of that month.
 */
function addMonth(day: string): string {
    const month = shiftMonth(day.slice(0, 7), 1);
    const sameDay = `${month}${day.slice(7)}`;
    const last = lastDayOf(month);
    return sameDay > last ? last : sameDay;
}

function nextDay(day: string): string {
    return new Date(Date.parse(`${day}T00:00:00Z`) + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
}

/**
 * The first price change after `day` (`YYYY-MM-DD`), if any.
 */
export function getNextPriceChange(
    fixedCost: Pick<FixedCost, "priceChanges">,
    day: string,
): PriceChange | null {
    return fixedCost.priceChanges.find((change) => change.date > day) ?? null;
}

/**
 * Why a price change can't be on `date`.
 */
export type PriceChangeProblem =
    "duplicate_date" | "before_start" | "after_end";

/**
 * Why a price change on `date` (`YYYY-MM-DD`) is invalid, or `null`. A
 * price change is after the start date, on or before the end date and on
 * a day without another one; `replacing` is the date of the price change
 * being edited, `null` for a new one.
 */
export function findPriceChangeProblem(
    fixedCost: Pick<FixedCost, "startDate" | "endDate" | "priceChanges">,
    date: string,
    replacing: string | null,
): PriceChangeProblem | null {
    if (date <= fixedCost.startDate) {
        return "before_start";
    }
    if (fixedCost.endDate !== null && date > fixedCost.endDate) {
        return "after_end";
    }
    if (
        date !== replacing &&
        fixedCost.priceChanges.some((change) => change.date === date)
    ) {
        return "duplicate_date";
    }
    return null;
}

/**
 * The price changes with `change` added, sorted by date; `replacing` is the
 * date of the price change it replaces, `null` for a new one.
 */
export function withPriceChange(
    priceChanges: PriceChange[],
    change: PriceChange,
    replacing: string | null,
): PriceChange[] {
    return [...priceChanges.filter((it) => it.date !== replacing), change].sort(
        (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0),
    );
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
