import _ from "lodash";
import { nameKey, roundToCents, sumNetSpending } from "../spending.ts";
import type { PatternDetector } from "./pattern-detector.ts";

/**
 * Below this amount a purchase counts as small.
 */
const LIMIT = 10;
const MIN_COUNT = 10;

/**
 * Share of all spending the small purchases must reach.
 */
const MIN_SHARE = 0.05;

/**
 * Many purchases under the small-purchase limit.
 */
export interface SmallPurchasesPattern {
    kind: "smallPurchases";
    limit: number;
    count: number;
    total: number;

    /**
     * The name at least a third of them share, if any.
     */
    topName: string | null;
}

export const smallPurchases: PatternDetector<SmallPurchasesPattern> = {
    detect({ current }) {
        const small = current.filter((t) => t.amount < LIMIT);
        const total = sumNetSpending(small);
        const spending = sumNetSpending(current);
        if (
            small.length < MIN_COUNT ||
            spending <= 0 ||
            total / spending < MIN_SHARE
        ) {
            return [];
        }
        const top = _.maxBy(_.values(_.groupBy(small, nameKey)), "length")!;
        return [
            {
                kind: "smallPurchases",
                limit: LIMIT,
                count: small.length,
                total: roundToCents(total),
                topName:
                    top.length * 3 >= small.length ? top[0]!.name.trim() : null,
            },
        ];
    },
};
