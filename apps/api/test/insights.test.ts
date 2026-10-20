import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MonthOverview } from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

const TIME_ZONE = "Europe/Berlin";

describe("month overview", () => {
    let alice: Client;
    let bob: Client;
    let id = 0;

    beforeEach(async () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-10-18T12:00:00Z"));
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
        bob = (await app.signUp("bob")).client;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    async function add(at: string, overrides: Record<string, unknown> = {}) {
        const response = await alice(`/api/transactions/t${++id}`, {
            method: "PUT",
            body: transactionBody({ date: Date.parse(at), ...overrides }),
        });
        expect(response.ok).toBe(true);
    }

    async function addFixedCost(overrides: Record<string, unknown>) {
        const response = await alice("/api/fixed-costs", {
            method: "POST",
            body: JSON.stringify({
                name: "Rent",
                description: null,
                amount: 12,
                currency: "EUR",
                interval: "monthly",
                categoryId: "1",
                active: true,
                startDate: "2026-01-01",
                endDate: null,
                ...overrides,
            }),
        });
        expect(response.ok).toBe(true);
    }

    function overview(client: Client, month: string, timeZone = TIME_ZONE) {
        return client(
            `/api/insights/overview?month=${month}&timeZone=${encodeURIComponent(timeZone)}`,
        );
    }

    beforeEach(async () => {
        // Typical months: up to the 18th, Jul 30, Aug 20, Sep 10.
        await add("2026-07-05T12:00:00Z", { amount: 30 });
        await add("2026-08-05T12:00:00Z", { amount: 20 });
        await add("2026-09-05T12:00:00Z", { amount: 10 });
        await add("2026-09-25T12:00:00Z", { amount: 50 });

        // October, in Berlin: 00:30 on the 1st is still September in UTC.
        await add("2026-09-30T22:30:00Z", { amount: 30 });
        await add("2026-10-02T12:00:00Z", { amount: 1000, exceptional: true });
        await add("2026-10-03T12:00:00Z", {
            kind: "income",
            amount: 100,
            categoryId: "1",
        });
    });

    it("sums the month in the user's time zone", async () => {
        const result = await json<MonthOverview>(overview(alice, "2026-10"));

        expect(result.netSpending).toBe(930);
        expect(result.income).toBe(100);
        expect(result.expenses).toBe(1030);
        expect(result.exceptional).toEqual({ count: 1, netSpending: 1000 });
    });

    it("compares a month in progress with the typical month up to today", async () => {
        const { pace } = await json<MonthOverview>(overview(alice, "2026-10"));

        expect(pace).toEqual({ day: 18, netSpending: -70, typical: 20 });
    });

    it("compares a past month as a whole", async () => {
        const { pace } = await json<MonthOverview>(overview(alice, "2026-09"));

        expect(pace).toEqual({ day: null, netSpending: 60, typical: 25 });
    });

    it("reports categories with their typical month, largest first", async () => {
        const { categories } = await json<MonthOverview>(
            overview(alice, "2026-10"),
        );

        expect(
            categories.map(({ categoryId, total, typical }) => ({
                categoryId,
                total,
                typical,
            })),
        ).toEqual([
            { categoryId: "2", total: 30, typical: 20 },
            { categoryId: "1", total: -100, typical: 0 },
        ]);
    });

    it("adds the monthly amounts of fixed costs running in the month", async () => {
        await addFixedCost({ amount: 12 });
        await addFixedCost({
            amount: 120,
            interval: "yearly",
            startDate: "2026-10-15",
        });
        await addFixedCost({ endDate: "2026-09-30" });
        await addFixedCost({ active: false });

        const { fixedCosts } = await json<MonthOverview>(
            overview(alice, "2026-10"),
        );

        expect(fixedCosts).toBe(22);
    });

    it("breaks the fixed costs running in the month down by fixed cost category, largest first", async () => {
        await addFixedCost({ amount: 12 });
        await addFixedCost({ name: "Power", amount: 3 });
        await addFixedCost({
            name: "Liability",
            amount: 240,
            interval: "yearly",
            categoryId: "7",
            startDate: "2026-10-31",
        });
        await addFixedCost({ categoryId: "7", endDate: "2026-09-30" });
        await addFixedCost({ categoryId: "9", active: false });

        const { fixedCosts, fixedCostCategories } = await json<MonthOverview>(
            overview(alice, "2026-10"),
        );

        expect(fixedCosts).toBe(35);
        expect(fixedCostCategories).toEqual([
            {
                categoryId: "7",
                categoryName: "Versicherungen",
                total: 20,
                fixedCosts: [
                    { id: expect.any(String), name: "Liability", total: 20 },
                ],
            },
            {
                categoryId: "1",
                categoryName: "Miete / Wohnung",
                total: 15,
                fixedCosts: [
                    { id: expect.any(String), name: "Rent", total: 12 },
                    { id: expect.any(String), name: "Power", total: 3 },
                ],
            },
        ]);
    });

    it("trends twelve months without exceptional transactions", async () => {
        const { trend } = await json<MonthOverview>(overview(alice, "2026-10"));

        expect(trend).toHaveLength(12);
        expect(trend[0]).toEqual({ month: "2025-11", total: 0 });
        expect(trend.at(-2)).toEqual({ month: "2026-09", total: 60 });
        expect(trend.at(-1)).toEqual({ month: "2026-10", total: -70 });
    });

    it("only reports the user's own data", async () => {
        const result = await json<MonthOverview>(overview(bob, "2026-10"));

        expect(result.netSpending).toBe(0);
        expect(result.categories).toEqual([]);
        expect(result.pace.typical).toBeNull();
    });

    it("rejects unknown time zones", async () => {
        expect((await overview(alice, "2026-10", "Mars/Olympus")).status).toBe(
            400,
        );
    });
});
