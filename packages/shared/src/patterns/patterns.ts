import _ from "lodash";
import { daysInMonths, shiftMonth } from "../calendar.ts";
import type { Category } from "../categories.ts";
import { placeInTimeZone, type SpendingInput } from "../spending.ts";
import { categoryDrift } from "./category-drift.ts";
import type { PatternContext } from "./pattern-detector.ts";
import { recurringName } from "./recurring-name.ts";
import { smallPurchases } from "./small-purchases.ts";
import { weekdayRhythm } from "./weekday-rhythm.ts";

/**
 * Months a pattern looks at, ending with the selected one.
 */
const WINDOW_MONTHS = 3;

/**
 * Every detector, in the order their patterns are shown. A new kind of
 * pattern is a new detector added here; nothing else changes.
 */
const DETECTORS = [
    categoryDrift,
    weekdayRhythm,
    recurringName,
    smallPurchases,
] as const;

/**
 * A regularity in spending over the three months ending with the selected
 * one, without exceptional transactions. See `Pattern` in the glossary.
 */
export type Pattern = ReturnType<(typeof DETECTORS)[number]["detect"]>[number];

/**
 * The first month whose transactions `findPatterns` needs: the window and
 * the window before it.
 */
export function firstPatternMonth(month: string): string {
    return shiftMonth(month, -(2 * WINDOW_MONTHS - 1));
}

interface FindPatternsInput {
    /**
     * `YYYY-MM`.
     */
    month: string;
    timeZone: string;

    /**
     * `YYYY-MM-DD` in `timeZone`; a month in progress counts up to it.
     */
    today: string;

    /**
     * At least those from `firstPatternMonth(month)` through `month`.
     */
    transactions: SpendingInput[];
    categories: Pick<Category, "id" | "name" | "color">[];
}

/**
 * The patterns of the three months ending with `month`.
 */
export function findPatterns({
    month,
    timeZone,
    today,
    transactions,
    categories,
}: FindPatternsInput): Pattern[] {
    const firstMonth = shiftMonth(month, -(WINDOW_MONTHS - 1));
    const previousFirstMonth = shiftMonth(firstMonth, -WINDOW_MONTHS);
    const expenses = placeInTimeZone(transactions, timeZone).filter(
        (t) => t.kind === "expense" && !t.exceptional && t.day <= today,
    );
    const byId = _.keyBy(categories, "id");

    const context: PatternContext = {
        current: expenses.filter(
            (t) => t.month >= firstMonth && t.month <= month,
        ),
        // A month in progress counts up to today.
        currentDays:
            today.slice(0, 7) === month
                ? daysInMonths(firstMonth, shiftMonth(month, -1)) +
                  Number(today.slice(8))
                : daysInMonths(firstMonth, month),
        previous: expenses.filter(
            (t) => t.month >= previousFirstMonth && t.month < firstMonth,
        ),
        previousDays: daysInMonths(
            previousFirstMonth,
            shiftMonth(firstMonth, -1),
        ),
        category(id) {
            const row = byId[id];
            return (
                row && {
                    categoryId: row.id,
                    categoryName: row.name,
                    categoryColor: row.color,
                }
            );
        },
    };

    return DETECTORS.flatMap((detector): Pattern[] => detector.detect(context));
}
