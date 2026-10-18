import _ from "lodash";
import { roundToCents, sumNetSpending } from "../spending.ts";
import type { PatternCategory, PatternDetector } from "./pattern-detector.ts";

/**
 * A category's spending in the earlier window before its drift counts.
 */
const MIN_PREVIOUS = 50;
const MIN_CHANGE = 0.25;
const MAX_SHOWN = 3;

/**
 * A category's spending per day against the three months before.
 */
export interface CategoryDriftPattern {
    kind: "categoryDrift";
    category: PatternCategory;
    change: number;
}

export const categoryDrift: PatternDetector<CategoryDriftPattern> = {
    detect({ current, currentDays, previous, previousDays, category }) {
        const currentByCategory = _.groupBy(current, "categoryId");
        const drifts = Object.entries(
            _.groupBy(previous, "categoryId"),
        ).flatMap(([categoryId, group]): CategoryDriftPattern[] => {
            const before = sumNetSpending(group);
            const info = category(categoryId);
            if (before < MIN_PREVIOUS || !info) {
                return [];
            }
            const after = sumNetSpending(currentByCategory[categoryId] ?? []);
            const change = after / currentDays / (before / previousDays) - 1;
            return Math.abs(change) >= MIN_CHANGE
                ? [
                      {
                          kind: "categoryDrift",
                          category: info,
                          change: roundToCents(change),
                      },
                  ]
                : [];
        });
        return _.take(
            _.orderBy(drifts, (drift) => Math.abs(drift.change), "desc"),
            MAX_SHOWN,
        );
    },
};
