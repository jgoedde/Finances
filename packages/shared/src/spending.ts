import _ from "lodash";
import { toIsoDate } from "./fixed-costs.ts";
import { netSpending, type Transaction } from "./transactions.ts";

/**
 * A transaction placed on its calendar day in the user's time zone.
 */
export interface DatedTransaction {
    /**
     * `YYYY-MM`.
     */
    month: string;

    /**
     * `YYYY-MM-DD`.
     */
    day: string;
    dayOfMonth: number;

    /**
     * 0 = Monday … 6 = Sunday.
     */
    weekday: number;
    counterparty: string;
    categoryId: string;
    kind: Transaction["kind"];
    amount: number;
    netSpending: number;
    exceptional: boolean;
}

export type SpendingInput = Pick<
    Transaction,
    "date" | "counterparty" | "kind" | "amount" | "exceptional" | "categoryId"
>;

/**
 * Places transactions on their day in `timeZone`.
 */
export function placeInTimeZone(
    transactions: SpendingInput[],
    timeZone: string,
): DatedTransaction[] {
    return transactions.map((transaction) => {
        const day = toIsoDate(transaction.date, timeZone);
        return {
            month: day.slice(0, 7),
            day,
            dayOfMonth: Number(day.slice(8)),
            weekday: (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7,
            counterparty: transaction.counterparty,
            categoryId: transaction.categoryId,
            kind: transaction.kind,
            amount: transaction.amount,
            netSpending: netSpending(transaction),
            exceptional: transaction.exceptional,
        };
    });
}

export function sumNetSpending(transactions: DatedTransaction[]): number {
    return _.sumBy(transactions, "netSpending");
}

export function median(values: number[]): number | null {
    if (values.length === 0) {
        return null;
    }
    const sorted = _.sortBy(values);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 1
        ? sorted[middle]!
        : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

/**
 * To cents.
 */
export function roundToCents(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Groups counterparties regardless of case and surrounding spaces.
 */
export function counterpartyKey(counterparty: string): string {
    return counterparty.trim().toLocaleLowerCase("de");
}
