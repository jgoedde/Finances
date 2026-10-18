import {
    type FixedCost as FixedCostRecord,
    type FixedCostCategory,
    type FixedCostInterval,
    getMonthlyAmount,
    getYearlyAmount,
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
        category: categories.find((c) => c.id === record.categoryId) ?? {
            id: "",
            name: m.fixed_cost_unknown_category(),
            description: null,
        },
        active: record.active,
        startDate: fromIsoDate(record.startDate),
        endDate: record.endDate ? fromIsoDate(record.endDate) : null,
        monthlyAmount: getMonthlyAmount(record),
        yearlyAmount: getYearlyAmount(record),
        isRunning: isRunningOn(record, toLocalIsoDate(new Date())),
    };
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

/**
 * Parses `YYYY-MM-DD` as a local date (not UTC midnight).
 */
function fromIsoDate(value: string): Date {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}
