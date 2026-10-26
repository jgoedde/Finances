import _ from "lodash";
import { z } from "zod";
import { lastDayOf, shiftMonth } from "./calendar.ts";
import {
    type FixedCost,
    type FixedCostInterval,
    fixedCostIntervalSchema,
    MONTHS_PER_INTERVAL,
    toIsoDate,
} from "./fixed-costs.ts";
import { monthInsightQuerySchema } from "./insights.ts";
import { counterpartyKey } from "./spending.ts";
import {
    type Transaction,
    transactionIdSchema,
    transactionSchema,
} from "./transactions.ts";

/**
 * Months before the new expense that a run may reach back.
 */
export const SUGGESTION_LOOKBACK_MONTHS = 13;

/**
 * How far an amount may differ from the new expense's, as a ratio of it.
 */
const AMOUNT_TOLERANCE = 0.05;

/**
 * How many days a charge may be off from one interval before the next.
 */
const DAY_TOLERANCE = 3;

/**
 * Charges, including the new expense, that make a run.
 */
const MIN_RUN = {
    monthly: 3,
    quarterly: 3,
    yearly: 2,
} as const satisfies Record<FixedCostInterval, number>;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The expense just created, which a fixed cost suggestion is checked for.
 */
export const fixedCostSuggestionQuerySchema = z.object({
    id: transactionIdSchema,
    counterparty: transactionSchema.shape.counterparty,
    amount: z.coerce.number<number>().nonnegative(),

    /**
     * Unix timestamp in milliseconds.
     */
    date: z.coerce.number<number>().int(),
    timeZone: monthInsightQuerySchema.shape.timeZone,
});
export type FixedCostSuggestionQuery = z.input<
    typeof fixedCostSuggestionQuerySchema
>;

/**
 * A run of expenses that looks like a fixed cost the user hasn't set up. See
 * `Fixed cost suggestion` in the glossary.
 */
export interface FixedCostSuggestion {
    counterparty: string;

    /**
     * The latest charge.
     */
    amount: number;
    interval: FixedCostInterval;

    /**
     * The next expected charge, `YYYY-MM-DD`.
     */
    startDate: string;
}

interface SuggestionInput {
    expense: Pick<Transaction, "id" | "date" | "counterparty" | "amount">;

    /**
     * At least the user's transactions from `SUGGESTION_LOOKBACK_MONTHS`
     * before the expense on; may include the expense itself.
     */
    transactions: Pick<
        Transaction,
        "id" | "date" | "counterparty" | "amount" | "kind" | "exceptional"
    >[];
    fixedCosts: Pick<FixedCost, "name" | "active">[];
    timeZone: string;
}

/**
 * The fixed cost suggestion the new expense completes, if any: it ends a
 * run of consecutive expenses with its counterparty, about its amount and
 * one interval apart, and no active fixed cost has that name.
 */
export function findFixedCostSuggestion({
    expense,
    transactions,
    fixedCosts,
    timeZone,
}: SuggestionInput): FixedCostSuggestion | null {
    const key = counterpartyKey(expense.counterparty);
    if (
        fixedCosts.some((it) => it.active && counterpartyKey(it.name) === key)
    ) {
        return null;
    }
    const day = toIsoDate(expense.date, timeZone);
    const others = transactions.filter(
        (it) =>
            it.id !== expense.id &&
            it.kind === "expense" &&
            !it.exceptional &&
            counterpartyKey(it.counterparty) === key,
    );
    // The run must end with the new expense.
    if (others.some((it) => it.date > expense.date)) {
        return null;
    }
    const from = shiftDay(day, -SUGGESTION_LOOKBACK_MONTHS);
    const previous = _.orderBy(others, "date", "desc")
        .map((it) => ({ day: toIsoDate(it.date, timeZone), amount: it.amount }))
        .filter((it) => it.day >= from);

    const interval = fixedCostIntervalSchema.options.find(
        (it) => runLength(day, expense.amount, previous, it) >= MIN_RUN[it],
    );
    return interval === undefined
        ? null
        : {
              counterparty: expense.counterparty.trim(),
              amount: expense.amount,
              interval,
              startDate: shiftDay(day, MONTHS_PER_INTERVAL[interval]),
          };
}

/**
 * Charges in the run ending on `day`, which is one of them: each previous
 * expense (newest first) continues it while about `amount` and a whole
 * number of intervals before `day`, one more than the one after it.
 */
function runLength(
    day: string,
    amount: number,
    previous: { day: string; amount: number }[],
    interval: FixedCostInterval,
): number {
    let count = 1;
    for (const charge of previous) {
        const expected = shiftDay(day, -count * MONTHS_PER_INTERVAL[interval]);
        if (
            Math.abs(charge.amount - amount) > amount * AMOUNT_TOLERANCE ||
            Math.abs(daysBetween(charge.day, expected)) > DAY_TOLERANCE
        ) {
            break;
        }
        count++;
    }
    return count;
}

/**
 * `day` (`YYYY-MM-DD`) shifted by `months`, clamped to the end of that
 * month.
 */
function shiftDay(day: string, months: number): string {
    const month = shiftMonth(day.slice(0, 7), months);
    const sameDay = `${month}${day.slice(7)}`;
    const last = lastDayOf(month);
    return sameDay > last ? last : sameDay;
}

function daysBetween(from: string, to: string): number {
    return Math.round(
        (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
            DAY_MS,
    );
}
