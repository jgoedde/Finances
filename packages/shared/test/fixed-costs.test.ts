import { describe, expect, it } from "vitest";
import {
    changeAmount,
    currentAmount,
    type FixedCost,
    type FixedCostAmount,
    getMonthlyAmount,
    getYearlyAmount,
    isRunningOn,
    rebaseAmounts,
    toIsoDate,
} from "#/fixed-costs.ts";

function fixedCost(overrides: Partial<FixedCost> = {}): FixedCost {
    return {
        id: "f1",
        name: "Miete",
        description: null,
        currency: "EUR",
        categoryId: "1",
        startDate: "2026-01-01",
        endDate: null,
        amounts: [
            { validFrom: "2026-01-01", amount: 120, interval: "monthly" },
        ],
        ...overrides,
    };
}

function amount(
    validFrom: string,
    value: number,
    interval: FixedCostAmount["interval"] = "monthly",
): FixedCostAmount {
    return { validFrom, amount: value, interval };
}

/**
 * Rent of 800 from January, 850 from April.
 */
const rent = fixedCost({
    amounts: [amount("2026-01-01", 800), amount("2026-04-01", 850)],
});

describe("currentAmount", () => {
    it("is the entry valid on the day", () => {
        expect(currentAmount(rent, "2026-03-31").amount).toBe(800);
        expect(currentAmount(rent, "2026-04-01").amount).toBe(850);
        expect(currentAmount(rent, "2099-12-31").amount).toBe(850);
    });

    it("is the first entry before the start date", () => {
        expect(currentAmount(rent, "2025-12-31").amount).toBe(800);
    });
});

describe("getMonthlyAmount", () => {
    it("spreads the amount over the months of its interval", () => {
        const of = (interval: FixedCostAmount["interval"]) =>
            getMonthlyAmount(
                fixedCost({ amounts: [amount("2026-01-01", 120, interval)] }),
                "2026-06-01",
            );
        expect(of("monthly")).toBe(120);
        expect(of("quarterly")).toBe(40);
        expect(of("yearly")).toBe(10);
    });

    it("uses the amount and interval valid on the day", () => {
        const insurance = fixedCost({
            amounts: [
                amount("2026-01-01", 120, "yearly"),
                amount("2026-07-01", 15),
            ],
        });
        expect(getMonthlyAmount(insurance, "2026-06-30")).toBe(10);
        expect(getMonthlyAmount(insurance, "2026-07-01")).toBe(15);
    });
});

describe("getYearlyAmount", () => {
    it("is twelve monthly amounts", () => {
        expect(getYearlyAmount(rent, "2026-02-01")).toBe(9600);
        expect(getYearlyAmount(rent, "2026-05-01")).toBe(10200);
    });
});

describe("changeAmount", () => {
    it("adds an entry from a day after the last one", () => {
        expect(changeAmount(rent.amounts, amount("2026-09-01", 900))).toEqual([
            amount("2026-01-01", 800),
            amount("2026-04-01", 850),
            amount("2026-09-01", 900),
        ]);
    });

    it("corrects the last entry from its own day or before", () => {
        const corrected = [
            amount("2026-01-01", 800),
            amount("2026-04-01", 860),
        ];
        expect(changeAmount(rent.amounts, amount("2026-04-01", 860))).toEqual(
            corrected,
        );
        expect(changeAmount(rent.amounts, amount("2026-02-01", 860))).toEqual(
            corrected,
        );
    });

    it("corrects the only entry from the start date", () => {
        expect(
            changeAmount(
                [amount("2026-01-01", 800)],
                amount("2026-01-01", 75, "quarterly"),
            ),
        ).toEqual([amount("2026-01-01", 75, "quarterly")]);
    });
});

describe("rebaseAmounts", () => {
    it("moves the first entry to an earlier start date", () => {
        expect(rebaseAmounts(rent.amounts, "2025-10-01")).toEqual([
            amount("2025-10-01", 800),
            amount("2026-04-01", 850),
        ]);
    });

    it("starts with the entry valid on a later start date", () => {
        expect(rebaseAmounts(rent.amounts, "2026-05-01")).toEqual([
            amount("2026-05-01", 850),
        ]);
        expect(rebaseAmounts(rent.amounts, "2026-02-01")).toEqual([
            amount("2026-02-01", 800),
            amount("2026-04-01", 850),
        ]);
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
