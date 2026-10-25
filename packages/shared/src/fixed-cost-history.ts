import { lastDayOf, shiftMonth } from "#/calendar.ts";
import {
    type FixedCostShare,
    groupByFixedCostCategory,
} from "#/fixed-cost-breakdown.ts";
import {
    type FixedCost,
    getMonthlyAmount,
    lastRunningDay,
} from "#/fixed-costs.ts";
import _ from "lodash";

/**
 * The monthly fixed-cost total of one month.
 */
export interface MonthlyFixedCostTotal {
    /**
     * `YYYY-MM`.
     */
    month: string;
    total: number;

    /**
     * The fixed costs running that month, largest monthly amount first.
     */
    fixedCosts: FixedCostShare[];
}

/**
 * The monthly fixed-cost total of every month from the earliest start date
 * to the month of `today` (`YYYY-MM-DD`). Inactive fixed costs never count;
 * the others count in every month they run on at least one day, with the
 * amount on their last running day of it.
 */
export function getMonthlyTotals(
    fixedCosts: FixedCost[],
    today: string,
): MonthlyFixedCostTotal[] {
    const active = fixedCosts.filter((it) => it.active);
    const first = _.min(active.map((it) => it.startDate.slice(0, 7)));
    const totals: MonthlyFixedCostTotal[] = [];
    if (first === undefined) {
        return totals;
    }
    for (
        let month = first;
        month <= today.slice(0, 7);
        month = shiftMonth(month, 1)
    ) {
        const running = groupByFixedCostCategory(
            active,
            `${month}-01`,
            lastDayOf(month),
        )
            .flatMap((group) => group.fixedCosts)
            .filter((it) => it.share !== null)
            .sort((a, b) => b.monthlyAmount - a.monthlyAmount);
        totals.push({
            month,
            total: _.sumBy(running, (it) => it.monthlyAmount),
            fixedCosts: running,
        });
    }
    return totals;
}

/**
 * A start, price change or end of a fixed cost, by month.
 */
export interface FixedCostChange {
    /**
     * `YYYY-MM`.
     */
    month: string;
    kind: "started" | "price_change" | "ended";
    fixedCost: FixedCost;

    /**
     * How much the fixed cost's monthly amount changes: its whole monthly
     * amount for a start, negative for an end.
     */
    delta: number;
}

/**
 * The starts, price changes and ends of the active fixed costs up to the
 * month of `today` (`YYYY-MM-DD`), newest first. Monthly amounts follow the
 * same rule as `getMonthlyTotals`, so a price change in the start month
 * counts as part of the start, and the price changes within a month as one.
 */
export function getFixedCostChanges(
    fixedCosts: FixedCost[],
    today: string,
): FixedCostChange[] {
    const changes = fixedCosts
        .filter((it) => it.active)
        .flatMap((fixedCost): FixedCostChange[] => {
            const monthlyAmountIn = (month: string) =>
                getMonthlyAmount(
                    fixedCost,
                    lastRunningDay(fixedCost, lastDayOf(month)),
                );
            const start = fixedCost.startDate.slice(0, 7);
            const priceChangeMonths = _.uniq(
                fixedCost.priceChanges
                    .map((it) => it.date.slice(0, 7))
                    .filter((month) => month > start),
            );
            const end = fixedCost.endDate?.slice(0, 7);
            return [
                {
                    month: start,
                    kind: "started",
                    fixedCost,
                    delta: monthlyAmountIn(start),
                },
                ...priceChangeMonths.map((month): FixedCostChange => ({
                    month,
                    kind: "price_change",
                    fixedCost,
                    delta:
                        monthlyAmountIn(month) -
                        monthlyAmountIn(shiftMonth(month, -1)),
                })),
                ...(end === undefined
                    ? []
                    : [
                          {
                              month: end,
                              kind: "ended" as const,
                              fixedCost,
                              delta: -monthlyAmountIn(end),
                          },
                      ]),
            ];
        })
        .filter((it) => it.month <= today.slice(0, 7));
    return _.orderBy(
        changes,
        [(it) => it.month, (it) => it.fixedCost.name],
        ["desc", "asc"],
    );
}
