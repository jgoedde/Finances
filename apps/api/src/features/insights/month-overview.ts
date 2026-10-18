import _ from "lodash";
import {
    type CategoryOverview,
    type FixedCost,
    getMonthlyAmount,
    type DatedTransaction,
    lastDayOf,
    median,
    type MonthOverview,
    placeInTimeZone,
    roundToCents,
    shiftMonth,
    type SpendingInput,
    sumNetSpending,
    toIsoDate,
} from "@finances/shared";
import type { CategoriesTable } from "#/db/schema.ts";
import { loadWindow } from "#/features/insights/insights.ts";

// Pure: the endpoint loads the rows, this aggregates them.

/**
 * Months in the trend, ending with the selected one.
 */
const TREND_MONTHS = 12;

/**
 * Complete months before the selected one that make up the typical month.
 */
const TYPICAL_MONTHS = 6;

/**
 * The instants (Unix ms) to load transactions for: the trend's months.
 */
export function overviewWindow(month: string): { from: number; to: number } {
    return loadWindow(shiftMonth(month, -(TREND_MONTHS - 1)), month);
}

interface MonthOverviewInput {
    /**
     * `YYYY-MM`.
     */
    month: string;
    timeZone: string;

    /**
     * Unix ms; decides how far a month in progress is compared.
     */
    now: number;

    /**
     * At least those within `overviewWindow(month)`.
     */
    transactions: SpendingInput[];
    categories: Pick<CategoriesTable, "id" | "name" | "color" | "icon_name">[];
    fixedCosts: FixedCost[];
}

/**
 * Aggregates one month at a glance; see `MonthOverview`.
 */
export function buildMonthOverview({
    month,
    timeZone,
    now,
    transactions: rows,
    categories: categoryRows,
    fixedCosts: allFixedCosts,
}: MonthOverviewInput): MonthOverview {
    const firstMonth = shiftMonth(month, -(TREND_MONTHS - 1));
    const transactions = placeInTimeZone(rows, timeZone);
    const inMonth = transactions.filter((t) => t.month === month);
    const typicalSpending = transactions.filter((t) => !t.exceptional);

    // A month in progress is compared up to today.
    const today = toIsoDate(now, timeZone);
    const day = today.slice(0, 7) === month ? Number(today.slice(8)) : null;
    const upToDay = (t: DatedTransaction) =>
        day === null || t.dayOfMonth <= day;

    // Complete months before this one, if they have transactions.
    const history = _.range(1, TYPICAL_MONTHS + 1)
        .map((i) => shiftMonth(month, -i))
        .filter((m) => transactions.some((t) => t.month === m));
    const sum = sumNetSpending;
    const typicalOf = (matches: (t: DatedTransaction) => boolean) => {
        const typical = median(
            history.map((m) =>
                sum(
                    typicalSpending.filter(
                        (t) => t.month === m && upToDay(t) && matches(t),
                    ),
                ),
            ),
        );
        return typical === null ? null : roundToCents(typical);
    };

    const categories: CategoryOverview[] = _.orderBy(
        categoryRows
            .map((category) => ({
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
                categoryIconName: category.icon_name,
                total: roundToCents(
                    sum(
                        typicalSpending.filter(
                            (t) =>
                                t.month === month &&
                                t.categoryId === category.id,
                        ),
                    ),
                ),
                typical: typicalOf((t) => t.categoryId === category.id),
            }))
            .filter(({ total, typical }) => total !== 0 || !!typical),
        "total",
        "desc",
    );

    const firstDay = `${month}-01`;
    const lastDay = lastDayOf(month);
    const fixedCosts = _.sumBy(
        // Running on at least one day of the month.
        allFixedCosts.filter(
            (fixedCost) =>
                fixedCost.active &&
                fixedCost.startDate <= lastDay &&
                (fixedCost.endDate === null || fixedCost.endDate >= firstDay),
        ),
        getMonthlyAmount,
    );

    const exceptional = inMonth.filter((t) => t.exceptional);
    return {
        netSpending: roundToCents(sum(inMonth)),
        income: roundToCents(
            _.sumBy(
                inMonth.filter((t) => t.kind === "income"),
                "amount",
            ),
        ),
        expenses: roundToCents(
            _.sumBy(
                inMonth.filter((t) => t.kind === "expense"),
                "amount",
            ),
        ),
        exceptional: {
            count: exceptional.length,
            netSpending: roundToCents(sum(exceptional)),
        },
        pace: {
            day,
            netSpending: roundToCents(
                sum(
                    typicalSpending.filter(
                        (t) => t.month === month && upToDay(t),
                    ),
                ),
            ),
            typical: typicalOf(() => true),
        },
        fixedCosts: roundToCents(fixedCosts),
        categories,
        trend: _.range(TREND_MONTHS).map((i) => {
            const m = shiftMonth(firstMonth, i);
            return {
                month: m,
                total: roundToCents(
                    sum(typicalSpending.filter((t) => t.month === m)),
                ),
            };
        }),
    };
}
