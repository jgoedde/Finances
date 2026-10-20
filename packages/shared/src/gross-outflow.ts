import { sumBy } from "lodash";
import type {
    CategoryOverview,
    FixedCostCategoryOverview,
    MonthOverview,
} from "#/insights.ts";

/**
 * Fraction (0–1) of the gross outflow.
 */
interface Share {
    share: number;
}

/**
 * One side of the gross outflow: fixed costs or spending.
 */
interface GrossOutflowSide<T> extends Share {
    total: number;

    /**
     * Largest first.
     */
    categories: T[];
}

type FixedCostCategoryShareOfOutflow = Omit<
    FixedCostCategoryOverview,
    "fixedCosts"
> &
    Share & {
        fixedCosts: (FixedCostCategoryOverview["fixedCosts"][number] & Share)[];
    };

type CategoryShareOfOutflow = CategoryOverview & Share;

/**
 * What a month's money went to (see "Gross outflow" in the glossary), with
 * every part's share of it.
 */
export interface GrossOutflow {
    total: number;
    fixedCosts: GrossOutflowSide<FixedCostCategoryShareOfOutflow>;
    spending: GrossOutflowSide<CategoryShareOfOutflow>;
}

/**
 * Breaks a month's gross outflow down into fixed costs and spending, by
 * category. Categories and fixed costs of 0 and categories with net
 * spending below 0 are left out; the overview already leaves out exceptional
 * transactions.
 */
export function breakDownGrossOutflow({
    fixedCostCategories: allFixedCostCategories,
    categories,
}: Pick<MonthOverview, "fixedCostCategories" | "categories">): GrossOutflow {
    const fixedCostCategories = allFixedCostCategories
        .filter((category) => category.total > 0)
        .map((category) => ({
            ...category,
            fixedCosts: category.fixedCosts.filter((it) => it.total > 0),
        }));
    const spending = categories.filter((category) => category.total > 0);
    const fixedCostsTotal = sumBy(fixedCostCategories, (it) => it.total);
    const spendingTotal = sumBy(spending, (it) => it.total);
    const total = fixedCostsTotal + spendingTotal;
    // Fixed costs may cost 0, so the total may be 0.
    const shareOf = (amount: number) => (total > 0 ? amount / total : 0);

    return {
        total,
        fixedCosts: {
            total: fixedCostsTotal,
            share: shareOf(fixedCostsTotal),
            categories: fixedCostCategories.map((category) => ({
                ...category,
                share: shareOf(category.total),
                fixedCosts: category.fixedCosts.map((fixedCost) => ({
                    ...fixedCost,
                    share: shareOf(fixedCost.total),
                })),
            })),
        },
        spending: {
            total: spendingTotal,
            share: shareOf(spendingTotal),
            categories: spending.map((category) => ({
                ...category,
                share: shareOf(category.total),
            })),
        },
    };
}
