import { describe, expect, it } from "vitest";
import {
    findCounterparty,
    matchCounterparty,
    rankCounterparties,
    summarizeCounterparties,
} from "#/counterparties.ts";
import type { Transaction } from "#/transactions.ts";

function transaction(
    overrides: Partial<Transaction> = {},
): Pick<Transaction, "name" | "date" | "categoryId" | "kind" | "amount"> {
    return {
        name: "Bäcker",
        date: new Date(2026, 9, 18, 8).getTime(),
        categoryId: "food",
        kind: "expense",
        amount: 3.5,
        ...overrides,
    };
}

describe("summarizeCounterparties", () => {
    it("groups names regardless of case and keeps the newest spelling", () => {
        const [counterparty] = summarizeCounterparties([
            transaction({ name: "aldi nord", date: 1 }),
            transaction({ name: "Aldi Nord ", date: 2, amount: 20 }),
        ]);
        expect(counterparty).toMatchObject({
            name: "Aldi Nord",
            count: 2,
            lastAmount: 20,
            dates: [2, 1],
        });
    });

    it("predicts the most frequent category and kind, ties to the newest", () => {
        const [counterparty] = summarizeCounterparties([
            transaction({ categoryId: "home", date: 1 }),
            transaction({ categoryId: "home", date: 2 }),
            transaction({ categoryId: "health", date: 3, kind: "income" }),
        ]);
        expect(counterparty?.categoryId).toBe("home");
        expect(counterparty?.kind).toBe("expense");

        const [tied] = summarizeCounterparties([
            transaction({ categoryId: "home", date: 1 }),
            transaction({ categoryId: "health", date: 2 }),
        ]);
        expect(tied?.categoryId).toBe("health");
    });

    it("sorts the most frequent first", () => {
        const names = summarizeCounterparties([
            transaction({ name: "Rewe" }),
            transaction({ name: "Aldi" }),
            transaction({ name: "Aldi" }),
        ]).map((it) => it.name);
        expect(names).toEqual(["Aldi", "Rewe"]);
    });
});

describe("findCounterparty", () => {
    it("finds a counterparty regardless of case", () => {
        const counterparties = summarizeCounterparties([
            transaction({ name: "Aldi Nord" }),
        ]);
        expect(findCounterparty(counterparties, " ALDI NORD")?.name).toBe(
            "Aldi Nord",
        );
        expect(findCounterparty(counterparties, "Aldi")).toBeUndefined();
    });
});

describe("rankCounterparties", () => {
    it("prefers counterparties usual at this time of day and weekday", () => {
        // Sunday 18 Oct 2026, 8:00.
        const now = new Date(2026, 9, 18, 8);
        const counterparties = summarizeCounterparties([
            transaction({
                name: "Bar",
                date: new Date(2026, 9, 16, 23).getTime(),
            }),
            transaction({
                name: "Bar",
                date: new Date(2026, 9, 15, 23).getTime(),
            }),
            transaction({
                name: "Bäcker",
                date: new Date(2026, 9, 11, 8).getTime(),
            }),
        ]);
        expect(
            rankCounterparties(counterparties, now, 2).map((it) => it.name),
        ).toEqual(["Bäcker", "Bar"]);
        expect(rankCounterparties(counterparties, now, 1)).toHaveLength(1);
    });
});

describe("matchCounterparty", () => {
    const counterparties = summarizeCounterparties([
        transaction({ name: "Aldi" }),
        transaction({ name: "Aldi Nord" }),
        transaction({ name: "Rewe" }),
    ]);

    it("matches the most specific counterparty within the raw name", () => {
        expect(
            matchCounterparty(counterparties, "ALDI NORD 1234 HAMBURG")?.name,
        ).toBe("Aldi Nord");
        expect(matchCounterparty(counterparties, "ALDI SAGT DANKE")?.name).toBe(
            "Aldi",
        );
        expect(matchCounterparty(counterparties, "REWE.Markt-GmbH")?.name).toBe(
            "Rewe",
        );
    });

    it("suggests the known spelling of a differently spelled name", () => {
        expect(matchCounterparty(counterparties, "REWE")?.name).toBe("Rewe");
    });

    it("matches nothing for a known name or unknown words", () => {
        expect(matchCounterparty(counterparties, "Rewe")).toBeUndefined();
        expect(matchCounterparty(counterparties, "Lidl 1234")).toBeUndefined();
        expect(matchCounterparty(counterparties, "Nordsee")).toBeUndefined();
    });
});
