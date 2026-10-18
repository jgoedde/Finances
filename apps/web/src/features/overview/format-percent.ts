import { getLocale } from "#/paraglide/runtime.js";

/** `0.123` as "12 %", or "+12 %" with `signed`. */
export function formatPercent(ratio: number, signed = false): string {
    return new Intl.NumberFormat(getLocale(), {
        style: "percent",
        maximumFractionDigits: 0,
        signDisplay: signed ? "exceptZero" : "auto",
    }).format(ratio);
}
