import { describe, expect, it } from "vitest";
import { groupByFixedCostCategory } from "#/fixed-cost-breakdown.ts";
import type { FixedCost } from "#/fixed-costs.ts";

function fixedCost(overrides: Partial<FixedCost> = {}): FixedCost {
    return {
        id: "f1",
        name: "Miete",
        description: null,
        amount: 100,
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

describe("groupByFixedCostCategory", () => {
    it("groups into fixed cost categories with their monthly amount and share, largest first", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({ id: "rent", categoryId: "housing", amount: 600 }),
                fixedCost({ id: "car", categoryId: "mobility", amount: 150 }),
                fixedCost({ id: "power", categoryId: "housing", amount: 100 }),
                fixedCost({ id: "bike", categoryId: "mobility", amount: 50 }),
                fixedCost({ id: "phone", categoryId: "media", amount: 100 }),
            ],
            TODAY,
        );

        expect(
            groups.map((g) => [g.categoryId, g.monthlyAmount, g.share]),
        ).toEqual([
            ["housing", 700, 0.7],
            ["mobility", 200, 0.2],
            ["media", 100, 0.1],
        ]);
    });

    it("counts only the fixed costs running on the day", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({ id: "rent", categoryId: "housing", amount: 300 }),
                fixedCost({ id: "off", categoryId: "housing", active: false }),
                fixedCost({ id: "later", startDate: "2026-07-01" }),
                fixedCost({ id: "ended", endDate: "2026-06-14" }),
                fixedCost({ id: "gym", categoryId: "sports", active: false }),
                fixedCost({ id: "car", categoryId: "mobility", amount: 100 }),
            ],
            TODAY,
        );

        expect(
            groups.map((g) => [g.categoryId, g.monthlyAmount, g.share]),
        ).toEqual([
            ["housing", 300, 0.75],
            ["mobility", 100, 0.25],
        ]);
    });

    it("spreads quarterly and yearly fixed costs over their months", () => {
        const [group] = groupByFixedCostCategory(
            [
                fixedCost({ id: "a", amount: 30, interval: "quarterly" }),
                fixedCost({ id: "b", amount: 120, interval: "yearly" }),
            ],
            TODAY,
        );

        expect(group?.monthlyAmount).toBe(20);
    });

    it("lists each group's fixed costs with their share of the total, largest first", () => {
        const housing = groupByFixedCostCategory(
            [
                fixedCost({ id: "power", name: "Strom", amount: 50 }),
                fixedCost({ id: "rent", name: "Miete", amount: 150 }),
                fixedCost({ id: "water", name: "Wasser", amount: 25 }),
                fixedCost({ id: "gas", name: "Gas", amount: 25 }),
                fixedCost({ id: "car", categoryId: "mobility", amount: 250 }),
            ],
            TODAY,
        ).find((g) => g.categoryId === "housing");

        expect(
            housing?.fixedCosts.map((it) => [
                it.fixedCost.id,
                it.monthlyAmount,
                it.share,
            ]),
        ).toEqual([
            ["rent", 150, 0.3],
            ["power", 50, 0.1],
            ["gas", 25, 0.05],
            ["water", 25, 0.05],
        ]);
    });

    it("orders categories with the same amount by their largest fixed cost's name", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({ id: "b", name: "B", categoryId: "x" }),
                fixedCost({ id: "a", name: "A", categoryId: "y" }),
            ],
            TODAY,
        );

        expect(groups.map((g) => g.categoryId)).toEqual(["y", "x"]);
    });

    it("is empty without running fixed costs", () => {
        expect(
            groupByFixedCostCategory([fixedCost({ active: false })], TODAY),
        ).toEqual([]);
    });
});
