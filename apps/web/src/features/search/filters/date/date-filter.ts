import { addMonths, addWeeks, addYears } from "date-fns";

export const DATE_FILTER_OPTIONS = [
    "any",
    "oneWeek",
    "oneMonth",
    "halfYear",
    "oneYear",
] as const;
export type DateFilterOption = (typeof DATE_FILTER_OPTIONS)[number];

/** Upper bound (Unix ms) for the option, or `undefined` for any date. */
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
            return "Beliebiger Zeitraum";
        case "oneWeek":
            return "Älter als eine Woche";
        case "oneMonth":
            return "Älter als einen Monat";
        case "halfYear":
            return "Älter als 6 Monate";
        case "oneYear":
            return "Älter als ein Jahr";
        default:
            throw new Error("Unrecognized date filter");
    }
}
