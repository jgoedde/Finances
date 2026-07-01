import { addMonths, addWeeks, addYears, isBefore } from "date-fns";
import type { Transaction } from "@/persistence/types.ts";

export type DateFilterOption =
    "any" | "oneWeek" | "oneMonth" | "halfYear" | "oneYear";

export function isMatchingDateFilter(
    transaction: Transaction,
    dateFilterOption: DateFilterOption,
) {
    if (dateFilterOption === "any") {
        return true;
    }

    const transactionDate = new Date(transaction.date);
    const now = new Date();
    switch (dateFilterOption) {
        case "oneWeek":
            return isBefore(transactionDate, addWeeks(now, -1));
        case "oneMonth":
            return isBefore(transactionDate, addMonths(now, -1));
        case "halfYear":
            return isBefore(transactionDate, addMonths(now, -6));
        case "oneYear":
            return isBefore(transactionDate, addYears(now, -1));
        default:
            return true;
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
