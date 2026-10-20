import { describe, expect, it } from "vitest";
import { breakDownGrossOutflow } from "#/gross-outflow.ts";
import type {
    CategoryOverview,
    FixedCostCategoryOverview,
} from "#/insights.ts";

function category(id: string, total: number): CategoryOverview {
    return {
        categoryId: id,
        categoryName: id,
        categoryColor: "#000000",
        categoryIconName: "Tag",
        total,
        typical: null,
    };
}

function fixedCostCategory(
    id: string,
    ...totals: number[]
): FixedCostCategoryOverview {
    return {
        categoryId: id,
        categoryName: id,
        total: totals.reduce((sum, total) => sum + total, 0),
        fixedCosts: totals.map((total, i) => ({
            id: `${id}${i}`,
            name: `${id}${i}`,
            total,
        })),
    };
}

describe("breakDownGrossOutflow", () => {
    it("splits fixed costs and spending with their shares of the gross outflow", () => {
        const outflow = breakDownGrossOutflow({
            fixedCostCategories: [
                fixedCostCategory("housing", 400, 100),
                fixedCostCategory("media", 100),
            ],
            categories: [category("food", 300), category("fun", 100)],
        });

        expect(outflow.total).toBe(1000);
        expect([outflow.fixedCosts.total, outflow.fixedCosts.share]).toEqual([
            600, 0.6,
        ]);
        expect(
            outflow.fixedCosts.categories.map((it) => [
                it.categoryId,
                it.share,
                it.fixedCosts.map((fixedCost) => fixedCost.share),
            ]),
        ).toEqual([
            ["housing", 0.5, [0.4, 0.1]],
            ["media", 0.1, [0.1]],
        ]);
        expect([outflow.spending.total, outflow.spending.share]).toEqual([
            400, 0.4,
        ]);
        expect(
            outflow.spending.categories.map((it) => [it.categoryId, it.share]),
        ).toEqual([
            ["food", 0.3],
            ["fun", 0.1],
        ]);
    });

    it("leaves out categories with net spending of 0 or less", () => {
        const outflow = breakDownGrossOutflow({
            fixedCostCategories: [],
            categories: [
                category("food", 100),
                category("salary", -2000),
                category("refunds", 0),
            ],
        });

        expect(outflow.total).toBe(100);
        expect(
            outflow.spending.categories.map((it) => [it.categoryId, it.share]),
        ).toEqual([["food", 1]]);
        expect(outflow.fixedCosts).toEqual({
            total: 0,
            share: 0,
            categories: [],
        });
    });

    it("leaves out fixed costs and fixed cost categories of 0", () => {
        const outflow = breakDownGrossOutflow({
            fixedCostCategories: [
                fixedCostCategory("housing", 100, 0),
                fixedCostCategory("free", 0),
            ],
            categories: [],
        });

        expect(
            outflow.fixedCosts.categories.map((it) => [
                it.categoryId,
                it.fixedCosts.map((fixedCost) => fixedCost.id),
            ]),
        ).toEqual([["housing", ["housing0"]]]);
    });

    it("has shares of 0 when there is no gross outflow", () => {
        const outflow = breakDownGrossOutflow({
            fixedCostCategories: [fixedCostCategory("free", 0)],
            categories: [category("refunds", -10)],
        });

        expect(outflow.total).toBe(0);
        expect(outflow.fixedCosts.share).toBe(0);
        expect(outflow.spending.share).toBe(0);
    });
});
