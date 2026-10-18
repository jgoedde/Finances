// Months are `YYYY-MM`, days `YYYY-MM-DD`; both are calendar values without
// a time zone.

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * `YYYY-MM` shifted by `by` months.
 */
export function shiftMonth(month: string, by: number): string {
    const [year, monthIndex] = month.split("-").map(Number);
    return new Date(Date.UTC(year!, monthIndex! - 1 + by, 1))
        .toISOString()
        .slice(0, 7);
}

/**
 * Unix ms of the first instant of the month in UTC.
 */
export function monthStartUtc(month: string): number {
    return Date.parse(`${month}-01T00:00:00Z`);
}

/**
 * The month's last day, `YYYY-MM-DD`.
 */
export function lastDayOf(month: string): string {
    return new Date(monthStartUtc(shiftMonth(month, 1)) - DAY_MS)
        .toISOString()
        .slice(0, 10);
}

/**
 * Days from the first of `firstMonth` through the end of `lastMonth`.
 */
export function daysInMonths(firstMonth: string, lastMonth: string): number {
    return Math.round(
        (monthStartUtc(shiftMonth(lastMonth, 1)) - monthStartUtc(firstMonth)) /
            DAY_MS,
    );
}
