// Display formatting. Pure: the caller passes the UI locale.

/**
 * `12.5` as "12,50 €" (de) or "€12.50" (en).
 */
export function formatCurrency(
    amount: number,
    locale: string,
    currency = "EUR",
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * `0.123` as "12 %" (de); with `signed`, "+12 %" and "-12 %".
 */
export function formatPercent(
    ratio: number,
    locale: string,
    { signed = false }: { signed?: boolean } = {},
): string {
    return new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
        signDisplay: signed ? "exceptZero" : "auto",
    }).format(ratio);
}

/**
 * The month of `date`, e.g. "Oktober 2026".
 */
export function formatMonthYear(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

/**
 * The abbreviated month name of `date`, e.g. "Okt".
 */
export function formatShortMonth(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, { month: "short" });
}

// Days back from today (today included) whose heading is relative.
const RELATIVE_DAYS = 7;

function startOfDay(date: Date): number {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    ).getTime();
}

/**
 * A day heading. Within the last week relative, then the date: "Heute · 18.
 * Oktober", "Gestern · 17. Oktober", "Donnerstag · 16. Oktober"; older and
 * future days e.g. "Sa., 11. Oktober".
 */
export function formatDayHeading(
    date: Date,
    today: Date,
    locale: string,
): string {
    // Rounded, since a day across a DST switch is 23 or 25 hours.
    const daysAgo = Math.round(
        (startOfDay(today) - startOfDay(date)) / (24 * 60 * 60 * 1000),
    );
    if (daysAgo < 0 || daysAgo >= RELATIVE_DAYS) {
        return date.toLocaleDateString(locale, {
            weekday: "short",
            day: "2-digit",
            month: "long",
        });
    }

    const relative =
        daysAgo < 2
            ? new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
                  -daysAgo,
                  "day",
              )
            : date.toLocaleDateString(locale, { weekday: "long" });
    const day = date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "long",
    });
    return `${relative.charAt(0).toLocaleUpperCase(locale)}${relative.slice(1)} · ${day}`;
}

/**
 * A day without the year, e.g. "18. Okt.".
 */
export function formatShortDate(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

/**
 * A full date, e.g. "18. Oktober 2026".
 */
export function formatLongDate(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, { dateStyle: "long" });
}

/**
 * A weekday's short name, 0 = Monday … 6 = Sunday, e.g. "Fr".
 */
export function formatWeekday(weekday: number, locale: string): string {
    // 2024-01-01 was a Monday.
    return new Date(2024, 0, 1 + weekday).toLocaleDateString(locale, {
        weekday: "short",
    });
}
