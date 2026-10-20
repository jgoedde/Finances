import {
    type FixedCost as FixedCostRecord,
    type FixedCostCategory,
    type FixedCostInterval,
    getMonthlyAmount,
    getYearlyAmount,
    groupByFixedCostCategory,
    isRunningOn,
    toIsoDate,
} from "@finances/shared";
import { m } from "#/paraglide/messages.js";

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
    amount: number;
    currency: string;
    interval: FixedCostInterval;
    category: FixedCostCategory;
    active: boolean;
    startDate: Date;
    endDate: Date | null;

    monthlyAmount: number;
    yearlyAmount: number;

    /**
     * Active and within its start/end range today.
     */
    isRunning: boolean;
}

export function toFixedCost(
    record: FixedCostRecord,
    categories: FixedCostCategory[],
): FixedCost {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        amount: record.amount,
        currency: record.currency,
        interval: record.interval,
        category: findCategory(record.categoryId, categories),
        active: record.active,
        startDate: fromIsoDate(record.startDate),
        endDate: record.endDate ? fromIsoDate(record.endDate) : null,
        monthlyAmount: getMonthlyAmount(record),
        yearlyAmount: getYearlyAmount(record),
        isRunning: isRunningOn(record, toLocalIsoDate(new Date())),
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
     * Rank among the groups with running fixed costs (0 = largest) and its
     * share of their monthly total; `null` when none of its fixed costs
     * runs.
     */
    rank: number | null;
    share: number | null;

    fixedCosts: FixedCostEntry[];
}

/**
 * Groups the fixed costs by fixed cost category, largest monthly amount
 * first (see `groupByFixedCostCategory`). Fixed costs not running today
 * follow in their group, or in groups of their own at the end.
 */
export function toCategoryGroups(
    records: FixedCostRecord[],
    categories: FixedCostCategory[],
): FixedCostCategoryGroup[] {
    const today = toLocalIsoDate(new Date());
    const groups = new Map<string, FixedCostCategoryGroup>(
        groupByFixedCostCategory(records, today).map((group, rank) => [
            group.categoryId,
            {
                category: findCategory(group.categoryId, categories),
                monthlyAmount: group.monthlyAmount,
                rank,
                share: group.share,
                fixedCosts: group.fixedCosts.map((it) => ({
                    fixedCost: toFixedCost(it.fixedCost, categories),
                    share: it.share,
                })),
            },
        ]),
    );

    // Records come sorted by name.
    for (const record of records.filter((it) => !isRunningOn(it, today))) {
        const group = groups.get(record.categoryId) ?? {
            category: findCategory(record.categoryId, categories),
            monthlyAmount: 0,
            rank: null,
            share: null,
            fixedCosts: [],
        };
        group.fixedCosts.push({
            fixedCost: toFixedCost(record, categories),
            share: null,
        });
        groups.set(record.categoryId, group);
    }

    return [...groups.values()];
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
            id: "",
            name: m.fixed_cost_unknown_category(),
            description: null,
        }
    );
}

/**
 * Parses `YYYY-MM-DD` as a local date (not UTC midnight).
 */
function fromIsoDate(value: string): Date {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}
