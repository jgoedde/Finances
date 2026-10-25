import { describe, expect, it } from "vitest";
import { groupByFixedCostCategory } from "#/fixed-cost-breakdown.ts";
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

describe("groupByFixedCostCategory", () => {
    it("groups into fixed cost categories with their monthly amount and share, largest first", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({
                    id: "rent",
                    categoryId: "housing",
                    initialAmount: 600,
                }),
                fixedCost({
                    id: "car",
                    categoryId: "mobility",
                    initialAmount: 150,
                }),
                fixedCost({
                    id: "power",
                    categoryId: "housing",
                    initialAmount: 100,
                }),
                fixedCost({
                    id: "bike",
                    categoryId: "mobility",
                    initialAmount: 50,
                }),
                fixedCost({
                    id: "phone",
                    categoryId: "media",
                    initialAmount: 100,
                }),
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
                fixedCost({
                    id: "rent",
                    categoryId: "housing",
                    initialAmount: 300,
                }),
                fixedCost({ id: "off", categoryId: "housing", active: false }),
                fixedCost({ id: "later", startDate: "2026-07-01" }),
                fixedCost({ id: "ended", endDate: "2026-06-14" }),
                fixedCost({
                    id: "car",
                    categoryId: "mobility",
                    initialAmount: 100,
                }),
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

    it("counts the fixed costs running on at least one day of a range", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({
                    id: "rent",
                    categoryId: "housing",
                    initialAmount: 300,
                }),
                fixedCost({
                    id: "ended",
                    categoryId: "media",
                    endDate: "2026-06-03",
                }),
                fixedCost({
                    id: "later",
                    categoryId: "mobility",
                    startDate: "2026-06-28",
                }),
                fixedCost({ id: "next", startDate: "2026-07-01" }),
                fixedCost({ id: "past", endDate: "2026-05-31" }),
            ],
            "2026-06-01",
            "2026-06-30",
        );

        expect(
            groups.map((g) => [g.categoryId, g.monthlyAmount, g.share]),
        ).toEqual([
            ["housing", 300, 0.6],
            ["media", 100, 0.2],
            ["mobility", 100, 0.2],
        ]);
    });

    it("lists fixed costs not running on the day without a share, after the running ones", () => {
        const housing = groupByFixedCostCategory(
            [
                fixedCost({ id: "rent", name: "Miete", initialAmount: 300 }),
                fixedCost({ id: "off", name: "Strom", active: false }),
                fixedCost({ id: "ended", name: "Gas", endDate: "2026-06-14" }),
            ],
            TODAY,
        ).find((g) => g.categoryId === "housing");

        expect(
            housing?.fixedCosts.map((it) => [it.fixedCost.id, it.share]),
        ).toEqual([
            ["rent", 1],
            ["ended", null],
            ["off", null],
        ]);
    });

    it("puts fixed cost categories without running fixed costs last, without amount and share", () => {
        const groups = groupByFixedCostCategory(
            [
                fixedCost({
                    id: "tv",
                    name: "TV",
                    categoryId: "media",
                    active: false,
                }),
                fixedCost({
                    id: "gym",
                    name: "Gym",
                    categoryId: "sports",
                    active: false,
                }),
                fixedCost({ id: "rent", categoryId: "housing" }),
            ],
            TODAY,
        );

        expect(
            groups.map((g) => [g.categoryId, g.monthlyAmount, g.share]),
        ).toEqual([
            ["housing", 100, 1],
            ["sports", 0, null],
            ["media", 0, null],
        ]);
    });

    it("spreads quarterly and yearly fixed costs over their months", () => {
        const [group] = groupByFixedCostCategory(
            [
                fixedCost({
                    id: "a",
                    initialAmount: 30,
                    interval: "quarterly",
                }),
                fixedCost({ id: "b", initialAmount: 120, interval: "yearly" }),
            ],
            TODAY,
        );

        expect(group?.monthlyAmount).toBe(20);
    });

    it("lists each group's fixed costs with their share of the total, largest first", () => {
        const housing = groupByFixedCostCategory(
            [
                fixedCost({ id: "power", name: "Strom", initialAmount: 50 }),
                fixedCost({ id: "rent", name: "Miete", initialAmount: 150 }),
                fixedCost({ id: "water", name: "Wasser", initialAmount: 25 }),
                fixedCost({ id: "gas", name: "Gas", initialAmount: 25 }),
                fixedCost({
                    id: "car",
                    categoryId: "mobility",
                    initialAmount: 250,
                }),
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

    it("gives running fixed costs a share of 0 when the total is 0", () => {
        const [group] = groupByFixedCostCategory(
            [fixedCost({ id: "free", initialAmount: 0 })],
            TODAY,
        );

        expect([group?.share, group?.fixedCosts[0]?.share]).toEqual([0, 0]);
    });

    it("is empty without fixed costs", () => {
        expect(groupByFixedCostCategory([], TODAY)).toEqual([]);
    });
});
