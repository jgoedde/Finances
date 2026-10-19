import { describe, expect, it } from "vitest";
import {
    matchesListQuery,
    netSpending,
    splitRemainder,
    type Transaction,
} from "#/transactions.ts";

function transaction(overrides: Partial<Transaction> = {}): Transaction {
    return {
        id: "t1",
        date: 1000,
        name: "Bäcker",
        description: null,
        kind: "expense",
        amount: 12.5,
        currency: "EUR",
        categoryId: "1",
        exceptional: false,
        ...overrides,
    };
}

describe("netSpending", () => {
    it("adds expenses and subtracts incomes", () => {
        expect(netSpending(transaction({ kind: "expense", amount: 30 }))).toBe(
            30,
        );
        expect(netSpending(transaction({ kind: "income", amount: 100 }))).toBe(
            -100,
        );
    });
});

describe("matchesListQuery", () => {
    it("matches dates within from and to, inclusive", () => {
        const query = { from: 1000, to: 2000 };
        expect(matchesListQuery(transaction({ date: 999 }), query)).toBe(false);
        expect(matchesListQuery(transaction({ date: 1000 }), query)).toBe(true);
        expect(matchesListQuery(transaction({ date: 2000 }), query)).toBe(true);
        expect(matchesListQuery(transaction({ date: 2001 }), query)).toBe(
            false,
        );
    });
});

describe("matchesListQuery filters", () => {
    const all = { from: 0, to: 5000 };
    const groceries = transaction({ categoryId: "1", kind: "expense" });
    const salary = transaction({ categoryId: "2", kind: "income" });
    const car = transaction({ exceptional: true });

    it("narrows to a category", () => {
        const query = { ...all, categoryId: "1" };
        expect(matchesListQuery(groceries, query)).toBe(true);
        expect(matchesListQuery(salary, query)).toBe(false);
    });

    it("narrows to a kind", () => {
        const query = { ...all, kind: "income" as const };
        expect(matchesListQuery(groceries, query)).toBe(false);
        expect(matchesListQuery(salary, query)).toBe(true);
    });

    it("leaves out exceptional transactions only when asked", () => {
        expect(matchesListQuery(car, all)).toBe(true);
        expect(
            matchesListQuery(car, { ...all, excludeExceptional: true }),
        ).toBe(false);
        expect(
            matchesListQuery(groceries, { ...all, excludeExceptional: true }),
        ).toBe(true);
    });
});

describe("splitRemainder", () => {
    it("leaves the total minus the parts for the main transaction", () => {
        expect(splitRemainder(50, [12])).toBe(38);
    });

    it("rounds to cents", () => {
        expect(splitRemainder(50, [12.3, 0.1])).toBe(37.6);
    });

    it("goes to zero or below when the parts cover the total", () => {
        expect(splitRemainder(50, [30, 20])).toBe(0);
        expect(splitRemainder(50, [30, 25.5])).toBe(-5.5);
    });
});
