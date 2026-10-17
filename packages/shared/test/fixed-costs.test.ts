import { describe, expect, it } from "vitest";
import {
    type FixedCost,
    isRunningOn,
    monthlyAmount,
    toIsoDate,
    yearlyAmount,
} from "../src/fixed-costs.ts";

function fixedCost(overrides: Partial<FixedCost> = {}): FixedCost {
    return {
        id: "f1",
        name: "Miete",
        description: null,
        amount: 120,
        currency: "EUR",
        interval: "monthly",
        categoryId: "1",
        active: true,
        startDate: "2026-01-01",
        endDate: null,
        ...overrides,
    };
}

describe("monthlyAmount", () => {
    it("spreads the amount over the months of its interval", () => {
        expect(monthlyAmount(fixedCost({ interval: "monthly" }))).toBe(120);
        expect(monthlyAmount(fixedCost({ interval: "quarterly" }))).toBe(40);
        expect(monthlyAmount(fixedCost({ interval: "yearly" }))).toBe(10);
    });
});

describe("yearlyAmount", () => {
    it("is twelve monthly amounts", () => {
        expect(yearlyAmount(fixedCost({ interval: "monthly" }))).toBe(1440);
        expect(yearlyAmount(fixedCost({ interval: "quarterly" }))).toBe(480);
        expect(yearlyAmount(fixedCost({ interval: "yearly" }))).toBe(120);
    });
});

describe("isRunningOn", () => {
    const march = fixedCost({ startDate: "2026-03-01", endDate: "2026-03-31" });

    it("runs from its start date through its end date", () => {
        expect(isRunningOn(march, "2026-02-28")).toBe(false);
        expect(isRunningOn(march, "2026-03-01")).toBe(true);
        expect(isRunningOn(march, "2026-03-31")).toBe(true);
        expect(isRunningOn(march, "2026-04-01")).toBe(false);
    });

    it("runs indefinitely without an end date", () => {
        expect(isRunningOn(fixedCost({ endDate: null }), "2099-12-31")).toBe(
            true,
        );
    });

    it("never runs while inactive", () => {
        expect(
            isRunningOn(
                fixedCost({
                    startDate: "2026-03-01",
                    endDate: "2026-03-31",
                    active: false,
                }),
                "2026-03-15",
            ),
        ).toBe(false);
    });
});

describe("toIsoDate", () => {
    it("gives the calendar day of an instant in a time zone", () => {
        const instant = Date.UTC(2026, 2, 1, 23, 30);
        expect(toIsoDate(instant, "UTC")).toBe("2026-03-01");
        expect(toIsoDate(instant, "Europe/Berlin")).toBe("2026-03-02");
        expect(toIsoDate(instant, "America/New_York")).toBe("2026-03-01");
    });

    it("pads months and days", () => {
        expect(toIsoDate(Date.UTC(2026, 0, 5, 12), "UTC")).toBe("2026-01-05");
    });
});
