import { groupBy, partition, sumBy } from "lodash";
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
     * Fraction (0–1) of the monthly total of all running fixed costs;
     * `null` while not running.
     */
    share: number | null;
}

/**
 * A fixed cost category's part of the monthly fixed-cost total.
 */
export interface FixedCostCategoryShare {
    categoryId: string;

    /**
     * Monthly amount of its running fixed costs.
     */
    monthlyAmount: number;

    /**
     * Fraction (0–1) of the monthly total of all running fixed costs;
     * `null` when none of its fixed costs runs.
     */
    share: number | null;

    /**
     * The running ones first, largest monthly amount first, then the
     * others by name.
     */
    fixedCosts: FixedCostShare[];
}

/**
 * Groups the fixed costs by fixed cost category, largest monthly amount
 * first. Only fixed costs running on `day` (`YYYY-MM-DD`) count: shares are
 * of their monthly total, so they add up to 1 (or are all 0 when that total
 * is 0). The others follow in their group without a share, and groups
 * without running fixed costs come last. Ties are ordered by name.
 */
export function groupByFixedCostCategory(
    fixedCosts: FixedCost[],
    day: string,
): FixedCostCategoryShare[] {
    const [running, stopped] = partition(fixedCosts, (it) =>
        isRunningOn(it, day),
    );
    const total = sumBy(running, getMonthlyAmount);
    // Fixed costs may cost 0, so the total may be 0.
    const shareOf = (amount: number) => (total > 0 ? amount / total : 0);

    const shares: FixedCostShare[] = [
        ...running
            .map((fixedCost) => {
                const monthlyAmount = getMonthlyAmount(fixedCost);
                return {
                    fixedCost,
                    monthlyAmount,
                    share: shareOf(monthlyAmount),
                };
            })
            .sort(
                (a, b) =>
                    b.monthlyAmount - a.monthlyAmount ||
                    compareNames(a.fixedCost.name, b.fixedCost.name),
            ),
        ...stopped
            .map((fixedCost) => ({
                fixedCost,
                monthlyAmount: getMonthlyAmount(fixedCost),
                share: null,
            }))
            .sort((a, b) => compareNames(a.fixedCost.name, b.fixedCost.name)),
    ];

    // `groupBy` keeps the order, so each group's first fixed cost is its
    // largest running one (or its first by name) and breaks ties between
    // groups.
    return Object.entries(groupBy(shares, (it) => it.fixedCost.categoryId))
        .map(([categoryId, group]): FixedCostCategoryShare => {
            const runningInGroup = group.filter((it) => it.share !== null);
            const monthlyAmount = sumBy(
                runningInGroup,
                (it) => it.monthlyAmount,
            );
            return {
                categoryId,
                monthlyAmount,
                share:
                    runningInGroup.length > 0 ? shareOf(monthlyAmount) : null,
                fixedCosts: group,
            };
        })
        .sort(
            (a, b) =>
                Number(a.share === null) - Number(b.share === null) ||
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
