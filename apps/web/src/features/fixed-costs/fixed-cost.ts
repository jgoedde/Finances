import type { CSSProperties } from "react";
import {
    type FixedCost as FixedCostRecord,
    type FixedCostCategory,
    type FixedCostInterval,
    type FixedCostPatch,
    getAmountOn,
    getMonthlyAmount,
    getNextPriceChange,
    getYearlyAmount,
    groupByFixedCostCategory,
    isRunningOn,
    toIsoDate,
} from "@finances/shared";
import { m } from "#/paraglide/messages.js";
import { paletteFromHue, toneStyle } from "#/utils/color.ts";

export const INTERVAL_LABELS = {
    monthly: m.fixed_cost_interval_monthly,
    quarterly: m.fixed_cost_interval_quarterly,
    yearly: m.fixed_cost_interval_yearly,
} as const satisfies Record<FixedCostInterval, () => string>;

/**
 * Fixed cost hydrated with its category and derived amounts, for the UI.
 */
export interface FixedCost {
    id: string;
    name: string;
    description: string | null;

    /**
     * What it charges per interval today.
     */
    amount: number;
    currency: string;
    interval: FixedCostInterval;
    category: FixedCostCategory;
    active: boolean;
    startDate: Date;
    endDate: Date | null;

    /**
     * From today's amount.
     */
    monthlyAmount: number;
    yearlyAmount: number;

    /**
     * Active and within its start/end range today.
     */
    isRunning: boolean;

    /**
     * The first price change after today, if any.
     */
    nextPriceChange: { date: Date; amount: number } | null;
}

/**
 * Hydrates a fixed cost; `today` (`YYYY-MM-DD`) decides the amounts and
 * `isRunning`.
 */
export function toFixedCost(
    record: FixedCostRecord,
    categories: FixedCostCategory[],
    today: string,
): FixedCost {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        amount: getAmountOn(record, today),
        currency: record.currency,
        interval: record.interval,
        category: findCategory(record.categoryId, categories),
        active: record.active,
        startDate: fromIsoDate(record.startDate),
        endDate: record.endDate ? fromIsoDate(record.endDate) : null,
        monthlyAmount: getMonthlyAmount(record, today),
        yearlyAmount: getYearlyAmount(record, today),
        isRunning: isRunningOn(record, today),
        nextPriceChange: toNextPriceChange(record, today),
    };
}

function toNextPriceChange(
    record: FixedCostRecord,
    today: string,
): FixedCost["nextPriceChange"] {
    const change = getNextPriceChange(record, today);
    return change && { date: fromIsoDate(change.date), amount: change.amount };
}

/**
 * The patch that corrects the amount on `day` (`YYYY-MM-DD`) to `amount`:
 * edits the price change that applies on that day, else the initial amount.
 * A correction, not a new price change.
 */
export function correctAmountOn(
    record: FixedCostRecord,
    day: string,
    amount: number,
): Pick<FixedCostPatch, "initialAmount" | "priceChanges"> {
    const past = record.priceChanges.filter((change) => change.date <= day);
    const applying = past[past.length - 1];
    if (applying === undefined) {
        return { initialAmount: amount };
    }
    return {
        priceChanges: record.priceChanges.map((change) =>
            change === applying ? { ...change, amount } : change,
        ),
    };
}

/**
 * A fixed cost with its share of the monthly total of the running fixed
 * costs; `null` while not running.
 */
export interface FixedCostEntry {
    fixedCost: FixedCost;
    share: number | null;
}

/**
 * A fixed cost category with its fixed costs, the running ones first.
 */
export interface FixedCostCategoryGroup {
    category: FixedCostCategory;

    /**
     * Monthly amount of its running fixed costs.
     */
    monthlyAmount: number;

    /**
     * Share of the monthly total of the running fixed costs; `null` when
     * none of its fixed costs runs.
     */
    share: number | null;

    /**
     * Its category's tone (see `toneStyle`); `null` when none of its fixed
     * costs runs.
     */
    toneStyle: CSSProperties | null;

    fixedCosts: FixedCostEntry[];
}

/**
 * Groups the fixed costs by fixed cost category, largest monthly amount
 * first (see `groupByFixedCostCategory`); fixed costs not running on
 * `today` (`YYYY-MM-DD`) have no share.
 */
export function toCategoryGroups(
    records: FixedCostRecord[],
    categories: FixedCostCategory[],
    today: string,
): FixedCostCategoryGroup[] {
    return groupByFixedCostCategory(records, today).map((group) => {
        const category = findCategory(group.categoryId, categories);
        return {
            category,
            monthlyAmount: group.monthlyAmount,
            share: group.share,
            toneStyle:
                group.share === null
                    ? null
                    : toneStyle(paletteFromHue(category.hue)),
            fixedCosts: group.fixedCosts.map((it) => ({
                fixedCost: toFixedCost(it.fixedCost, categories, today),
                share: it.share,
            })),
        };
    });
}

/**
 * The date's calendar day in the device's time zone, as `YYYY-MM-DD`.
 */
export function toLocalIsoDate(date: Date): string {
    return toIsoDate(
        date.getTime(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
}

function findCategory(
    id: string,
    categories: FixedCostCategory[],
): FixedCostCategory {
    return (
        categories.find((c) => c.id === id) ?? {
            // Keeps keys and element ids unique while categories load.
            id,
            name: m.fixed_cost_unknown_category(),
            description: null,
            hue: 0,
        }
    );
}

/**
 * Parses `YYYY-MM-DD` as a local date (not UTC midnight).
 */
export function fromIsoDate(value: string): Date {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}
