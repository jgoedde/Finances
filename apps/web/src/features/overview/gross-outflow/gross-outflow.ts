import { useMemo, type CSSProperties } from "react";
import { breakDownGrossOutflow, type MonthOverview } from "@finances/shared";
import { m } from "#/paraglide/messages.js";
import { getCategoryToneStyle, getRankedToneStyle } from "#/utils/color.ts";

/**
 * A fixed cost within its fixed cost category.
 */
export interface GrossOutflowFixedCost {
    id: string;
    name: string;
    total: number;
    share: number;
}

/**
 * A category of the gross outflow with its tone for the `ranked-tone`
 * utility: fixed cost categories fade through the primary palette by rank,
 * spending categories keep their own color.
 */
export type GrossOutflowCategory = {
    id: string;
    name: string;
    total: number;
    share: number;
    toneStyle: CSSProperties;
} & (
    | { kind: "fixedCosts"; fixedCosts: GrossOutflowFixedCost[] }
    | { kind: "spending" }
);

/**
 * Fixed costs or spending, with their categories, largest first.
 */
export interface GrossOutflowSide {
    kind: GrossOutflowCategory["kind"];
    total: number;
    share: number;
    categories: GrossOutflowCategory[];
}

export const SIDE_LABELS = {
    fixedCosts: m.fixed_costs_title,
    spending: m.overview_gross_outflow_spending,
} as const satisfies Record<GrossOutflowSide["kind"], () => string>;

export interface GrossOutflowView {
    total: number;

    /**
     * Fixed costs first; a side without categories is left out.
     */
    sides: GrossOutflowSide[];
}

/**
 * The month's gross outflow (see `breakDownGrossOutflow`), toned for the
 * charts.
 */
export function useGrossOutflow(overview: MonthOverview): GrossOutflowView {
    return useMemo(() => {
        const { total, fixedCosts, spending } = breakDownGrossOutflow({
            categories: overview.categories,
            // Missing in overviews cached by an older version.
            fixedCostCategories: overview.fixedCostCategories ?? [],
        });
        const count = fixedCosts.categories.length;
        const sides: GrossOutflowSide[] = [
            {
                kind: "fixedCosts",
                total: fixedCosts.total,
                share: fixedCosts.share,
                categories: fixedCosts.categories.map((category, rank) => ({
                    kind: "fixedCosts",
                    id: category.categoryId,
                    name: category.categoryName,
                    total: category.total,
                    share: category.share,
                    toneStyle: getRankedToneStyle(rank, count),
                    fixedCosts: category.fixedCosts,
                })),
            },
            {
                kind: "spending",
                total: spending.total,
                share: spending.share,
                categories: spending.categories.map((category) => ({
                    kind: "spending",
                    id: category.categoryId,
                    name: category.categoryName,
                    total: category.total,
                    share: category.share,
                    toneStyle: getCategoryToneStyle(category.categoryColor),
                })),
            },
        ];

        return {
            total,
            sides: sides.filter((side) => side.categories.length > 0),
        };
    }, [overview]);
}
