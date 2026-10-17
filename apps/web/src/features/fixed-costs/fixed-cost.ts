import type {
    FixedCost as FixedCostRecord,
    FixedCostCategory,
    FixedCostInterval,
} from "@finances/shared";

/** Fixed cost hydrated with its category and derived amounts, for the UI. */
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
    /** Active and within its start/end range today. */
    isRunning: boolean;
}

const INTERVAL_DIVISOR: Record<FixedCostInterval, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12,
};

const UNKNOWN_CATEGORY: FixedCostCategory = {
    id: "",
    name: "Unbekannt",
    description: null,
};

/** Whether the fixed cost is active and runs on the given day. */
export function isRunningOn(fixedCost: FixedCostRecord, date: Date): boolean {
    const day = toIsoDate(date);
    return (
        fixedCost.active &&
        fixedCost.startDate <= day &&
        (fixedCost.endDate === null || fixedCost.endDate >= day)
    );
}

export function toFixedCost(
    record: FixedCostRecord,
    categories: FixedCostCategory[],
): FixedCost {
    const monthlyAmount = record.amount / INTERVAL_DIVISOR[record.interval];
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        amount: record.amount,
        currency: record.currency,
        interval: record.interval,
        category:
            categories.find((c) => c.id === record.categoryId) ??
            UNKNOWN_CATEGORY,
        active: record.active,
        startDate: fromIsoDate(record.startDate),
        endDate: record.endDate ? fromIsoDate(record.endDate) : null,
        monthlyAmount,
        yearlyAmount: monthlyAmount * 12,
        isRunning: isRunningOn(record, new Date()),
    };
}

/** Local calendar date as `YYYY-MM-DD`. */
export function toIsoDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

/** Parses `YYYY-MM-DD` as a local date (not UTC midnight). */
function fromIsoDate(value: string): Date {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}
