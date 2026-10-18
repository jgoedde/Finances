import _ from "lodash";
import { nameKey, roundToCents } from "../spending.ts";
import type { PatternDetector } from "./pattern-detector.ts";

/**
 * Purchases with the same name to count as recurring.
 */
const MIN_COUNT = 4;
const MAX_SHOWN = 3;

/**
 * Frequent purchases with the same name.
 */
export interface RecurringNamePattern {
    kind: "recurringName";
    name: string;
    count: number;
    average: number;
}

export const recurringName: PatternDetector<RecurringNamePattern> = {
    detect({ current }) {
        const recurring = _.values(_.groupBy(current, nameKey)).filter(
            (group) => group.length >= MIN_COUNT,
        );
        return _.take(_.orderBy(recurring, "length", "desc"), MAX_SHOWN).map(
            (group) => ({
                kind: "recurringName",
                name: group[0]!.name.trim(),
                count: group.length,
                average: roundToCents(_.meanBy(group, "netSpending")),
            }),
        );
    },
};
