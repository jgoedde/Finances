import { groupBy, sumBy } from "lodash";
import {
    type FixedCost,
    getMonthlyAmount,
    isRunningOn,
} from "#/fixed-costs.ts";

/**
 * A fixed cost's part of the monthly fixed-cost total.
 */
export interface FixedCostShare {
    fixedCost: FixedCost;
    monthlyAmount: number;

    /**
     * Fraction (0–1) of the monthly total of all running fixed costs.
     */
    share: number;
}

/**
 * A fixed cost category's part of the monthly fixed-cost total.
 */
export interface FixedCostCategoryShare {
    categoryId: string;
    monthlyAmount: number;

    /**
     * Fraction (0–1) of the monthly total of all running fixed costs.
     */
    share: number;

    /**
     * Largest monthly amount first.
     */
    fixedCosts: FixedCostShare[];
}

/**
 * Groups the fixed costs running on `day` (`YYYY-MM-DD`) by fixed cost
 * category, largest monthly amount first. Shares are of the monthly total
 * of those fixed costs, so they add up to 1. Ties are ordered by name.
 */
export function groupByFixedCostCategory(
    fixedCosts: FixedCost[],
    day: string,
): FixedCostCategoryShare[] {
    const running = fixedCosts.filter((it) => isRunningOn(it, day));
    const total = sumBy(running, getMonthlyAmount);
    // Fixed costs may cost 0, so the total may be 0.
    const shareOf = (amount: number) => (total > 0 ? amount / total : 0);

    const shares = running
        .map((fixedCost) => {
            const monthlyAmount = getMonthlyAmount(fixedCost);
            return { fixedCost, monthlyAmount, share: shareOf(monthlyAmount) };
        })
        .sort(
            (a, b) =>
                b.monthlyAmount - a.monthlyAmount ||
                compareNames(a.fixedCost.name, b.fixedCost.name),
        );

    // `groupBy` keeps the order, so each group's largest fixed cost comes
    // first and breaks ties between groups.
    return Object.entries(groupBy(shares, (it) => it.fixedCost.categoryId))
        .map(([categoryId, group]) => {
            const monthlyAmount = sumBy(group, (it) => it.monthlyAmount);
            return {
                categoryId,
                monthlyAmount,
                share: shareOf(monthlyAmount),
                fixedCosts: group,
            };
        })
        .sort(
            (a, b) =>
                b.monthlyAmount - a.monthlyAmount ||
                compareNames(
                    a.fixedCosts[0]?.fixedCost.name ?? "",
                    b.fixedCosts[0]?.fixedCost.name ?? "",
                ),
        );
}

/**
 * Binary order, the same on server and client.
 */
function compareNames(a: string, b: string): number {
    return a < b ? -1 : a > b ? 1 : 0;
}
