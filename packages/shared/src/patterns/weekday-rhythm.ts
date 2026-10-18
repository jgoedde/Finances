import _ from "lodash";
import { roundToCents, sumNetSpending } from "../spending.ts";
import type { PatternCategory, PatternDetector } from "./pattern-detector.ts";

/**
 * A category needs this many purchases before its weekdays mean anything.
 */
const MIN_COUNT = 8;

/**
 * Share of a category's spending on two neighboring weekdays; spread evenly
 * it would be 2/7 (29 %).
 */
const MIN_SHARE = 0.5;
const MAX_SHOWN = 2;

/**
 * Most of a category's spending falls on two neighboring weekdays.
 */
export interface WeekdayRhythmPattern {
    kind: "weekdayRhythm";
    category: PatternCategory;

    /**
     * 0 = Monday … 6 = Sunday; `lastWeekday` follows `firstWeekday`,
     * wrapping from Sunday to Monday.
     */
    firstWeekday: number;
    lastWeekday: number;
    share: number;
}

export const weekdayRhythm: PatternDetector<WeekdayRhythmPattern> = {
    detect({ current, category }) {
        const rhythms = Object.entries(
            _.groupBy(current, "categoryId"),
        ).flatMap(([categoryId, group]): WeekdayRhythmPattern[] => {
            const total = sumNetSpending(group);
            const info = category(categoryId);
            if (group.length < MIN_COUNT || total <= 0 || !info) {
                return [];
            }
            const perWeekday = _.range(7).map((weekday) =>
                sumNetSpending(group.filter((t) => t.weekday === weekday)),
            );
            const pairTotal = (weekday: number) =>
                perWeekday[weekday]! + perWeekday[(weekday + 1) % 7]!;
            // The busiest pair of neighboring weekdays.
            const firstWeekday = _.maxBy(_.range(7), pairTotal)!;
            const share = pairTotal(firstWeekday) / total;
            return share >= MIN_SHARE
                ? [
                      {
                          kind: "weekdayRhythm",
                          category: info,
                          firstWeekday,
                          lastWeekday: (firstWeekday + 1) % 7,
                          share: roundToCents(share),
                      },
                  ]
                : [];
        });
        return _.take(_.orderBy(rhythms, "share", "desc"), MAX_SHOWN);
    },
};
