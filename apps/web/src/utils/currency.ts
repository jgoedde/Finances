import { getLocale } from "#/paraglide/runtime.js";

/** Formats in the UI language; the currency is always EUR. */
export function formatEuro(value: number | string): string {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat(getLocale(), {
        style: "currency",
        currency: "EUR",
    }).format(numberValue);
}
