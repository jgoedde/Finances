import { addMonths, addWeeks, addYears } from "date-fns";
import { m } from "#/paraglide/messages.js";

export const DATE_FILTER_OPTIONS = [
    "any",
    "oneWeek",
    "oneMonth",
    "halfYear",
    "oneYear",
] as const;
export type DateFilterOption = (typeof DATE_FILTER_OPTIONS)[number];

/**
 * Upper bound (Unix ms) for the option, or `undefined` for any date.
 */
export function getOlderThan(option: DateFilterOption): number | undefined {
    const now = new Date();
    switch (option) {
        case "any":
            return undefined;
        case "oneWeek":
            return addWeeks(now, -1).getTime();
        case "oneMonth":
            return addMonths(now, -1).getTime();
        case "halfYear":
            return addMonths(now, -6).getTime();
        case "oneYear":
            return addYears(now, -1).getTime();
    }
}

export function getDateFilterStr(option: DateFilterOption) {
    switch (option) {
        case "any":
            return m.period_any();
        case "oneWeek":
            return m.period_older_than_week();
        case "oneMonth":
            return m.period_older_than_month();
        case "halfYear":
            return m.period_older_than_half_year();
        case "oneYear":
            return m.period_older_than_year();
        default:
            throw new Error("Unrecognized date filter");
    }
}
