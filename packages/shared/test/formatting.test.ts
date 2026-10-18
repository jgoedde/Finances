import { describe, expect, it } from "vitest";
import {
    formatCurrency,
    formatDayHeading,
    formatLongDate,
    formatMonthYear,
    formatPercent,
    formatShortDate,
    formatShortMonth,
    formatWeekday,
} from "#/formatting.ts";

// Intl separates numbers and units with no-break spaces.
const nbsp = (text: string) => text.replaceAll(" ", " ");

const date = new Date(2026, 9, 18);

describe("formatting", () => {
    it("formats currency per locale", () => {
        expect(formatCurrency(1234.5, "de")).toBe(nbsp("1.234,50 €"));
        expect(formatCurrency(1234.5, "en")).toBe("€1,234.50");
        expect(formatCurrency(-3, "de", "USD")).toBe(nbsp("-3,00 $"));
    });

    it("formats percent, signed on request", () => {
        expect(formatPercent(0.123, "de")).toBe(nbsp("12 %"));
        expect(formatPercent(0.123, "en")).toBe("12%");
        expect(formatPercent(0.25, "de", { signed: true })).toBe(nbsp("+25 %"));
        expect(formatPercent(-0.25, "en", { signed: true })).toBe("-25%");
        expect(formatPercent(0, "en", { signed: true })).toBe("0%");
    });

    it("formats months", () => {
        expect(formatMonthYear(date, "de")).toBe("Oktober 2026");
        expect(formatMonthYear(date, "en")).toBe("October 2026");
        expect(formatShortMonth(date, "de")).toBe("Okt");
        expect(formatShortMonth(date, "en")).toBe("Oct");
    });

    it("formats days", () => {
        expect(formatDayHeading(date, "de")).toBe("So., 18. Oktober");
        expect(formatDayHeading(date, "en")).toBe("Sun, October 18");
        expect(formatLongDate(date, "de")).toBe("18. Oktober 2026");
        expect(formatLongDate(date, "en")).toBe("October 18, 2026");
        expect(formatShortDate(date, "de")).toBe("18. Okt.");
        expect(formatShortDate(date, "en")).toBe("Oct 18");
    });

    it("formats weekdays from Monday", () => {
        expect(formatWeekday(0, "de")).toBe("Mo");
        expect(formatWeekday(4, "en")).toBe("Fri");
        expect(formatWeekday(6, "de")).toBe("So");
    });
});
