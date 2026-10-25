import { describe, expect, it } from "vitest";
import { getFixedCostChanges, getMonthlyTotals } from "#/fixed-cost-history.ts";
import type { FixedCost } from "#/fixed-costs.ts";

function fixedCost(overrides: Partial<FixedCost> = {}): FixedCost {
    return {
        id: "f1",
        name: "Miete",
        description: null,
        initialAmount: 100,
        priceChanges: [],
        currency: "EUR",
        interval: "monthly",
        categoryId: "housing",
        active: true,
        startDate: "2026-01-01",
        endDate: null,
        ...overrides,
    };
}

const TODAY = "2026-06-15";

describe("getMonthlyTotals", () => {
    it("has a total for every month from the earliest start to today's month", () => {
        const totals = getMonthlyTotals(
            [
                fixedCost({ id: "rent", startDate: "2026-03-10" }),
                fixedCost({
                    id: "car",
                    startDate: "2026-05-01",
                    initialAmount: 60,
                    interval: "quarterly",
                }),
            ],
            TODAY,
        );

        expect(totals.map((it) => [it.month, it.total])).toEqual([
            ["2026-03", 100],
            ["2026-04", 100],
            ["2026-05", 120],
            ["2026-06", 120],
        ]);
    });

    it("counts a mid-month price change for its whole month", () => {
        const totals = getMonthlyTotals(
            [
                fixedCost({
                    startDate: "2026-03-01",
                    priceChanges: [{ date: "2026-04-15", amount: 130 }],
                }),
            ],
            TODAY,
        );

        expect(totals.map((it) => it.total)).toEqual([100, 130, 130, 130]);
    });

    it("counts an ended fixed cost through its end month and never an inactive one", () => {
        const totals = getMonthlyTotals(
            [
                fixedCost({
                    id: "gym",
                    name: "Gym",
                    startDate: "2026-04-01",
                    endDate: "2026-05-03",
                    initialAmount: 30,
                }),
                fixedCost({
                    id: "rent",
                    startDate: "2026-04-01",
                    initialAmount: 500,
                }),
                fixedCost({
                    id: "off",
                    startDate: "2026-01-01",
                    active: false,
                }),
            ],
            TODAY,
        );

        expect(
            totals.map((it) => [
                it.month,
                it.total,
                it.fixedCosts.map((share) => share.fixedCost.id),
            ]),
        ).toEqual([
            ["2026-04", 530, ["rent", "gym"]],
            ["2026-05", 530, ["rent", "gym"]],
            ["2026-06", 500, ["rent"]],
        ]);
    });

    it("is empty without active fixed costs", () => {
        expect(getMonthlyTotals([fixedCost({ active: false })], TODAY)).toEqual(
            [],
        );
    });
});

describe("getFixedCostChanges", () => {
    it("lists starts, price changes and ends up to today's month with their monthly amount delta, newest first", () => {
        const changes = getFixedCostChanges(
            [
                fixedCost({
                    id: "rent",
                    startDate: "2026-01-20",
                    initialAmount: 500,
                    priceChanges: [
                        { date: "2026-03-15", amount: 550 },
                        { date: "2026-07-01", amount: 600 },
                    ],
                }),
                fixedCost({
                    id: "insurance",
                    startDate: "2026-02-01",
                    endDate: "2026-05-31",
                    initialAmount: 120,
                    interval: "yearly",
                }),
                fixedCost({ id: "later", startDate: "2026-07-01" }),
            ],
            TODAY,
        );

        expect(
            changes.map((it) => [it.month, it.kind, it.fixedCost.id, it.delta]),
        ).toEqual([
            ["2026-05", "ended", "insurance", -10],
            ["2026-03", "price_change", "rent", 50],
            ["2026-02", "started", "insurance", 10],
            ["2026-01", "started", "rent", 500],
        ]);
    });

    it("folds a price change in the start month into the start", () => {
        const changes = getFixedCostChanges(
            [
                fixedCost({
                    startDate: "2026-03-01",
                    priceChanges: [{ date: "2026-03-20", amount: 80 }],
                }),
            ],
            TODAY,
        );

        expect(changes.map((it) => [it.month, it.kind, it.delta])).toEqual([
            ["2026-03", "started", 80],
        ]);
    });

    it("leaves out inactive fixed costs", () => {
        expect(
            getFixedCostChanges([fixedCost({ active: false })], TODAY),
        ).toEqual([]);
    });
});
