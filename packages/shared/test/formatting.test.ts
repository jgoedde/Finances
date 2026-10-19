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
        expect(formatLongDate(date, "de")).toBe("18. Oktober 2026");
        expect(formatLongDate(date, "en")).toBe("October 18, 2026");
        expect(formatShortDate(date, "de")).toBe("18. Okt.");
        expect(formatShortDate(date, "en")).toBe("Oct 18");
    });

    it("formats recent day headings relative to today", () => {
        const daysAgo = (days: number) => new Date(2026, 9, 18 - days);
        expect(formatDayHeading(daysAgo(0), date, "de")).toBe(
            "Heute · 18. Oktober",
        );
        expect(formatDayHeading(daysAgo(1), date, "de")).toBe(
            "Gestern · 17. Oktober",
        );
        expect(formatDayHeading(daysAgo(1), date, "en")).toBe(
            "Yesterday · October 17",
        );
        expect(formatDayHeading(daysAgo(2), date, "de")).toBe(
            "Freitag · 16. Oktober",
        );
        expect(formatDayHeading(daysAgo(6), date, "en")).toBe(
            "Monday · October 12",
        );
    });

    it("formats older and future day headings as dates", () => {
        expect(formatDayHeading(new Date(2026, 9, 11), date, "de")).toBe(
            "So., 11. Oktober",
        );
        expect(formatDayHeading(new Date(2026, 9, 11), date, "en")).toBe(
            "Sun, October 11",
        );
        expect(formatDayHeading(new Date(2026, 9, 19), date, "de")).toBe(
            "Mo., 19. Oktober",
        );
    });

    it("counts calendar days across a DST switch", () => {
        // Clocks go back on 2026-10-25 in Europe.
        expect(
            formatDayHeading(
                new Date(2026, 9, 25, 23),
                new Date(2026, 9, 26, 0, 30),
                "en",
            ),
        ).toBe("Yesterday · October 25");
    });

    it("formats weekdays from Monday", () => {
        expect(formatWeekday(0, "de")).toBe("Mo");
        expect(formatWeekday(4, "en")).toBe("Fri");
        expect(formatWeekday(6, "de")).toBe("So");
    });
});
