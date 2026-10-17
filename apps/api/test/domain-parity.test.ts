import { beforeEach, describe, expect, it } from "vitest";
import {
    matchesListQuery,
    netSpending,
    type Transaction,
    type TransactionListQuery,
} from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

// The API filters and sums in SQL; the shared functions are the reference.

const fixtures: Transaction[] = [
    tx({ id: "a", date: 1000, amount: 10.1, categoryId: "1" }),
    tx({ id: "b", date: 2000, amount: 0.2 }),
    tx({ id: "c", date: 2000, kind: "income", amount: 100 }),
    tx({
        id: "d",
        date: 3000,
        amount: 999.99,
        categoryId: "1",
        exceptional: true,
    }),
    tx({ id: "e", date: 4000, kind: "income", amount: 0.3, categoryId: "1" }),
    tx({ id: "f", date: 5000, amount: 7.45 }),
];

const queries: TransactionListQuery[] = [
    { from: 0, to: 10_000 },
    { from: 2000, to: 4000 },
    { from: 2001, to: 3999 },
    { from: 0, to: 10_000, categoryId: "1" },
    { from: 0, to: 10_000, kind: "expense" },
    { from: 0, to: 10_000, kind: "income" },
    { from: 0, to: 10_000, excludeExceptional: true },
    { from: 1000, to: 3000, categoryId: "1", kind: "expense" },
];

function tx(overrides: Partial<Transaction> & { id: string }): Transaction {
    return {
        ...(JSON.parse(transactionBody()) as Omit<Transaction, "id">),
        ...overrides,
    };
}

function toSearchParams(query: TransactionListQuery) {
    return new URLSearchParams(
        Object.entries(query).map(([key, value]) => [key, String(value)]),
    );
}

describe("domain parity", () => {
    let alice: Client;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
        for (const { id, ...input } of fixtures) {
            await alice(`/api/transactions/${id}`, {
                method: "PUT",
                body: JSON.stringify(input),
            });
        }
    });

    it.each(queries)("lists what matchesListQuery matches: %o", async (q) => {
        const listed = await json<Transaction[]>(
            alice(`/api/transactions?${toSearchParams(q).toString()}`),
        );

        const expected = fixtures.filter((t) => matchesListQuery(t, q));
        expect(listed.map((t) => t.id).sort()).toEqual(
            expected.map((t) => t.id).sort(),
        );
    });

    it.each(queries.filter((q) => !q.categoryId && !q.excludeExceptional))(
        "reports spent as the sum of netSpending: %o",
        async (q) => {
            const { total } = await json<{ total: number }>(
                alice(`/api/insights/spent?${toSearchParams(q).toString()}`),
            );

            const sum = fixtures
                .filter((t) => matchesListQuery(t, q))
                .reduce((total, t) => total + netSpending(t), 0);
            // Income alone is reported as a positive amount.
            expect(total).toBeCloseTo(q.kind === "income" ? -sum : sum, 2);
        },
    );
});
