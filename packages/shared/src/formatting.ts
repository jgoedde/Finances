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

/**
 * A day heading, e.g. "Sa., 18. Oktober".
 */
export function formatDayHeading(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, {
        weekday: "short",
        day: "2-digit",
        month: "long",
    });
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
