import { z } from "zod";
import { format, isValid, parse, startOfMonth } from "date-fns";
import { getRouteApi } from "@tanstack/react-router";

const MONTH_FORMAT = "yyyy-MM";

/**
 * `?month=YYYY-MM`; omitted for the current month.
 */
export const monthSearchSchema = z.object({
    month: z
        .string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
        .optional()
        .catch(undefined),
});

/**
 * The first day of the month, or of the current month without one.
 */
function parseMonth(month: string | undefined): Date {
    const date = month ? parse(month, MONTH_FORMAT, new Date()) : new Date();
    return startOfMonth(isValid(date) ? date : new Date());
}

/**
 * The search param for a month; undefined for the current month.
 */
export function toMonthParam(date: Date): string | undefined {
    const month = format(date, MONTH_FORMAT);
    return month === format(new Date(), MONTH_FORMAT) ? undefined : month;
}

const shellRoute = getRouteApi("/_authed/_shell");

/**
 * The first day of the month the app shell is looking at.
 */
export function useSelectedMonth(): Date {
    const { month } = shellRoute.useSearch();
    return parseMonth(month);
}
