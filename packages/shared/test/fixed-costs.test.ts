import { describe, expect, it } from "vitest";
import {
    findPriceChangeProblem,
    type FixedCost,
    getAmountOn,
    getMonthlyAmount,
    getNextPriceChange,
    getPriceHistory,
    getYearlyAmount,
    isRunningOn,
    toIsoDate,
    withPriceChange,
} from "#/fixed-costs.ts";

function fixedCost(overrides: Partial<FixedCost> = {}): FixedCost {
    return {
        id: "f1",
        name: "Miete",
        description: null,
        initialAmount: 120,
        priceChanges: [],
        currency: "EUR",
        interval: "monthly",
        categoryId: "1",
        active: true,
        startDate: "2026-01-01",
        endDate: null,
        ...overrides,
    };
}

const DAY = "2026-06-01";

describe("getAmountOn", () => {
    const withChanges = fixedCost({
        priceChanges: [
            { date: "2026-03-15", amount: 130 },
            { date: "2026-07-01", amount: 150 },
        ],
    });

    it("is the initial amount before the first price change", () => {
        expect(getAmountOn(withChanges, "2026-01-01")).toBe(120);
        expect(getAmountOn(withChanges, "2026-03-14")).toBe(120);
    });

    it("is the amount of the latest price change on or before the day", () => {
        expect(getAmountOn(withChanges, "2026-03-15")).toBe(130);
        expect(getAmountOn(withChanges, "2026-06-30")).toBe(130);
        expect(getAmountOn(withChanges, "2026-07-01")).toBe(150);
        expect(getAmountOn(withChanges, "2099-12-31")).toBe(150);
    });

    it("is the initial amount without price changes", () => {
        expect(getAmountOn(fixedCost(), "2099-12-31")).toBe(120);
    });
});

describe("getMonthlyAmount", () => {
    it("spreads the amount over the months of its interval", () => {
        expect(getMonthlyAmount(fixedCost({ interval: "monthly" }), DAY)).toBe(
            120,
        );
        expect(
            getMonthlyAmount(fixedCost({ interval: "quarterly" }), DAY),
        ).toBe(40);
        expect(getMonthlyAmount(fixedCost({ interval: "yearly" }), DAY)).toBe(
            10,
        );
    });

    it("uses the amount on the day", () => {
        const yearly = fixedCost({
            interval: "yearly",
            priceChanges: [{ date: "2026-05-01", amount: 240 }],
        });
        expect(getMonthlyAmount(yearly, "2026-04-30")).toBe(10);
        expect(getMonthlyAmount(yearly, "2026-05-01")).toBe(20);
    });
});

describe("getYearlyAmount", () => {
    it("is twelve monthly amounts", () => {
        expect(getYearlyAmount(fixedCost({ interval: "monthly" }), DAY)).toBe(
            1440,
        );
        expect(getYearlyAmount(fixedCost({ interval: "quarterly" }), DAY)).toBe(
            480,
        );
        expect(getYearlyAmount(fixedCost({ interval: "yearly" }), DAY)).toBe(
            120,
        );
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

describe("getPriceHistory", () => {
    it("is only the start while there are no price changes", () => {
        expect(getPriceHistory(fixedCost(), DAY)).toEqual([
            {
                date: "2026-01-01",
                amount: 120,
                change: null,
                status: "current",
                isStart: true,
            },
        ]);
    });

    it("lists upcoming, current and past amounts, newest first", () => {
        const history = getPriceHistory(
            fixedCost({
                priceChanges: [
                    { date: "2026-03-15", amount: 150 },
                    { date: "2026-07-01", amount: 120 },
                ],
            }),
            DAY,
        );
        expect(history).toEqual([
            {
                date: "2026-07-01",
                amount: 120,
                change: -0.2,
                status: "upcoming",
                isStart: false,
            },
            {
                date: "2026-03-15",
                amount: 150,
                change: 0.25,
                status: "current",
                isStart: false,
            },
            {
                date: "2026-01-01",
                amount: 120,
                change: null,
                status: "past",
                isStart: true,
            },
        ]);
    });
});

describe("getNextPriceChange", () => {
    it("is the first price change after the day", () => {
        const withChanges = fixedCost({
            priceChanges: [
                { date: "2026-03-15", amount: 130 },
                { date: "2026-07-01", amount: 150 },
                { date: "2027-01-01", amount: 160 },
            ],
        });
        expect(getNextPriceChange(withChanges, DAY)).toEqual({
            date: "2026-07-01",
            amount: 150,
        });
        expect(getNextPriceChange(withChanges, "2026-07-01")).toEqual({
            date: "2027-01-01",
            amount: 160,
        });
    });

    it("is null without upcoming price changes", () => {
        expect(getNextPriceChange(fixedCost(), DAY)).toBeNull();
        expect(
            getNextPriceChange(
                fixedCost({
                    priceChanges: [{ date: "2026-03-15", amount: 130 }],
                }),
                DAY,
            ),
        ).toBeNull();
    });
});

describe("findPriceChangeProblem", () => {
    const withChange = fixedCost({
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        priceChanges: [{ date: "2026-03-15", amount: 130 }],
    });

    it("accepts a date after the start and on or before the end", () => {
        expect(
            findPriceChangeProblem(withChange, "2026-01-02", null),
        ).toBeNull();
        expect(
            findPriceChangeProblem(withChange, "2026-12-31", null),
        ).toBeNull();
        expect(
            findPriceChangeProblem(fixedCost(), "2030-01-01", null),
        ).toBeNull();
    });

    it("rejects a date on or before the start", () => {
        expect(findPriceChangeProblem(withChange, "2026-01-01", null)).toBe(
            "before_start",
        );
        expect(findPriceChangeProblem(withChange, "2025-06-01", null)).toBe(
            "before_start",
        );
    });

    it("rejects a date after the end", () => {
        expect(findPriceChangeProblem(withChange, "2027-01-01", null)).toBe(
            "after_end",
        );
    });

    it("rejects the date of another price change", () => {
        expect(findPriceChangeProblem(withChange, "2026-03-15", null)).toBe(
            "duplicate_date",
        );
    });

    it("lets the edited price change keep its date", () => {
        expect(
            findPriceChangeProblem(withChange, "2026-03-15", "2026-03-15"),
        ).toBeNull();
    });
});

describe("withPriceChange", () => {
    const changes = [
        { date: "2026-03-15", amount: 130 },
        { date: "2026-07-01", amount: 150 },
    ];

    it("adds a price change in date order", () => {
        expect(
            withPriceChange(changes, { date: "2026-05-01", amount: 140 }, null),
        ).toEqual([
            { date: "2026-03-15", amount: 130 },
            { date: "2026-05-01", amount: 140 },
            { date: "2026-07-01", amount: 150 },
        ]);
    });

    it("replaces the edited price change, also when its date moves", () => {
        expect(
            withPriceChange(
                changes,
                { date: "2026-08-01", amount: 135 },
                "2026-03-15",
            ),
        ).toEqual([
            { date: "2026-07-01", amount: 150 },
            { date: "2026-08-01", amount: 135 },
        ]);
    });
});
