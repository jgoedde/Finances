import _ from "lodash";
import { counterpartyKey, roundToCents } from "../spending.ts";
import type { PatternDetector } from "./pattern-detector.ts";

/**
 * Purchases from the same counterparty to count as recurring.
 */
const MIN_COUNT = 4;
const MAX_SHOWN = 3;

/**
 * Frequent purchases from the same counterparty.
 */
export interface RecurringCounterpartyPattern {
    kind: "recurringCounterparty";
    counterparty: string;
    count: number;
    average: number;
}

export const recurringCounterparty: PatternDetector<RecurringCounterpartyPattern> =
    {
        detect({ current }) {
            const recurring = _.values(
                _.groupBy(current, (t) => counterpartyKey(t.counterparty)),
            ).filter((group) => group.length >= MIN_COUNT);
            return _.take(
                _.orderBy(recurring, "length", "desc"),
                MAX_SHOWN,
            ).map((group) => ({
                kind: "recurringCounterparty",
                counterparty: group[0]!.counterparty.trim(),
                count: group.length,
                average: roundToCents(_.meanBy(group, "netSpending")),
            }));
        },
    };
