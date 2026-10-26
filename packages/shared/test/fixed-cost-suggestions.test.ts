import { describe, expect, it } from "vitest";
import { findFixedCostSuggestion } from "#/fixed-cost-suggestions.ts";

type SuggestionInput = Parameters<typeof findFixedCostSuggestion>[0];

const TIME_ZONE = "Europe/Berlin";

let nextId = 0;

function expense(
    day: string,
    overrides: Partial<SuggestionInput["expense"]> = {},
) {
    return {
        id: `t${++nextId}`,
        date: Date.parse(`${day}T12:00:00Z`),
        counterparty: "Netflix",
        amount: 12.99,
        ...overrides,
    };
}

/**
 * Earlier expenses, as stored.
 */
function history(
    days: string[],
    overrides: Partial<SuggestionInput["transactions"][number]> = {},
): SuggestionInput["transactions"] {
    return days.map((day) => ({
        ...expense(day),
        kind: "expense",
        exceptional: false,
        ...overrides,
    }));
}

function suggest(
    newExpense: SuggestionInput["expense"],
    transactions: SuggestionInput["transactions"],
    fixedCosts: SuggestionInput["fixedCosts"] = [],
) {
    return findFixedCostSuggestion({
        expense: newExpense,
        transactions,
        fixedCosts,
        timeZone: TIME_ZONE,
    });
}

describe("findFixedCostSuggestion", () => {
    it("suggests a monthly fixed cost after the third charge", () => {
        expect(
            suggest(
                expense("2026-10-15"),
                history(["2026-08-15", "2026-09-15"]),
            ),
        ).toEqual({
            counterparty: "Netflix",
            amount: 12.99,
            interval: "monthly",
            startDate: "2026-11-15",
        });
    });

    it("needs three monthly charges", () => {
        expect(suggest(expense("2026-10-15"), history(["2026-09-15"]))).toBe(
            null,
        );
    });

    it("allows the amount to differ by 5 %", () => {
        const charges = history(["2026-08-15", "2026-09-15"], {
            amount: 100,
        });

        expect(
            suggest(expense("2026-10-15", { amount: 105 }), charges)?.amount,
        ).toBe(105);
        expect(suggest(expense("2026-10-15", { amount: 106 }), charges)).toBe(
            null,
        );
    });

    it("allows the day of the month to differ by 3 days", () => {
        expect(
            suggest(
                expense("2026-10-15"),
                history(["2026-08-12", "2026-09-18"]),
            )?.interval,
        ).toBe("monthly");
        expect(
            suggest(
                expense("2026-10-15"),
                history(["2026-08-15", "2026-09-19"]),
            ),
        ).toBe(null);
    });

    it("follows charges at the end of the month", () => {
        expect(
            suggest(
                expense("2026-03-31"),
                history(["2026-01-31", "2026-02-28"]),
            ),
        ).toMatchObject({ interval: "monthly", startDate: "2026-04-30" });
    });

    it("suggests a quarterly fixed cost after the third charge", () => {
        expect(
            suggest(
                expense("2026-10-01"),
                history(["2026-04-01", "2026-07-02"]),
            ),
        ).toMatchObject({ interval: "quarterly", startDate: "2027-01-01" });
    });

    it("suggests a yearly fixed cost after the second charge", () => {
        expect(
            suggest(expense("2026-10-01"), history(["2025-10-03"])),
        ).toMatchObject({ interval: "yearly", startDate: "2027-10-01" });
    });

    it("ignores runs that stopped before the new expense", () => {
        expect(
            suggest(
                expense("2026-10-15"),
                history(["2026-02-15", "2026-03-15", "2026-04-15"]),
            ),
        ).toBe(null);
    });

    it("needs the run to end with the new expense", () => {
        expect(
            suggest(
                expense("2026-09-15"),
                history(["2026-07-15", "2026-08-15", "2026-10-15"]),
            ),
        ).toBe(null);
    });

    it("never matches counterparties with varying purchases", () => {
        expect(
            suggest(expense("2026-10-15", { counterparty: "Rewe" }), [
                ...history(["2026-08-15", "2026-09-15"], {
                    counterparty: "Rewe",
                }),
                ...history(["2026-09-01"], {
                    counterparty: "Rewe",
                    amount: 54.2,
                }),
            ]),
        ).toBe(null);
    });

    it("skips incomes and exceptional transactions", () => {
        const charges = history(["2026-08-15", "2026-09-15"]);

        expect(
            suggest(expense("2026-10-15"), [
                ...charges,
                ...history(["2026-09-01"], { amount: 500, exceptional: true }),
                ...history(["2026-09-02"], { kind: "income" }),
            ]),
        ).not.toBe(null);
        expect(
            suggest(
                expense("2026-10-15"),
                history(["2026-08-15", "2026-09-15"], { exceptional: true }),
            ),
        ).toBe(null);
    });

    it("groups counterparties regardless of case", () => {
        expect(
            suggest(
                expense("2026-10-15", { counterparty: " netflix " }),
                history(["2026-08-15", "2026-09-15"]),
            )?.counterparty,
        ).toBe("netflix");
    });

    it("ignores the new expense if it is already stored", () => {
        const newExpense = expense("2026-10-15");

        expect(
            suggest(newExpense, [
                ...history(["2026-08-15", "2026-09-15"]),
                { ...newExpense, kind: "expense", exceptional: false },
            ]),
        ).not.toBe(null);
    });

    it("stays silent if an active fixed cost has the counterparty's name", () => {
        const charges = history(["2026-08-15", "2026-09-15"]);

        expect(
            suggest(expense("2026-10-15"), charges, [
                { name: "NETFLIX ", active: true },
            ]),
        ).toBe(null);
        expect(
            suggest(expense("2026-10-15"), charges, [
                { name: "Netflix", active: false },
            ]),
        ).not.toBe(null);
    });
});
