import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Pattern } from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

const TIME_ZONE = "Europe/Berlin";

// "Today" is Sunday, 2026-10-18; the window for October is Aug–Oct, the one
// before it May–Jul.
describe("patterns", () => {
    let alice: Client;
    let id = 0;

    beforeEach(async () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-10-18T12:00:00Z"));
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    async function add(day: string, overrides: Record<string, unknown> = {}) {
        const response = await alice(`/api/transactions/t${++id}`, {
            method: "PUT",
            body: transactionBody({
                date: Date.parse(`${day}T12:00:00Z`),
                name: `Purchase ${id}`,
                amount: 20,
                ...overrides,
            }),
        });
        expect(response.ok).toBe(true);
    }

    function patterns(month = "2026-10") {
        return json<Pattern[]>(
            alice(
                `/api/insights/patterns?month=${month}&timeZone=${encodeURIComponent(TIME_ZONE)}`,
            ),
        );
    }

    function ofKind<K extends Pattern["kind"]>(list: Pattern[], kind: K) {
        return list.filter(
            (p): p is Extract<Pattern, { kind: K }> => p.kind === kind,
        );
    }

    it("finds nothing in little data", async () => {
        await add("2026-10-02", { name: "Lidl" });
        await add("2026-10-03", { name: "Lidl", amount: 5 });
        await add("2026-09-12", { amount: 300 });

        expect(await patterns()).toEqual([]);
    });

    it("finds names bought from again and again", async () => {
        for (const day of ["2026-08-04", "2026-09-01", "2026-09-15"]) {
            await add(day, { name: "Lidl", amount: 12 });
        }
        await add("2026-10-06", { name: " lidl", amount: 16 });
        for (const day of ["2026-08-05", "2026-09-02", "2026-10-07"]) {
            await add(day, { name: "Rewe" });
        }

        expect(await patterns()).toEqual([
            { kind: "recurringName", name: "Lidl", count: 4, average: 13 },
        ]);
    });

    it("finds spending that clusters on two neighboring weekdays", async () => {
        // Fridays and Saturdays, plus two Tuesdays.
        for (const day of [
            "2026-10-02",
            "2026-10-03",
            "2026-10-09",
            "2026-10-10",
            "2026-10-16",
            "2026-10-17",
            "2026-10-06",
            "2026-10-13",
        ]) {
            await add(day, { categoryId: "1" });
        }

        expect(await patterns()).toMatchObject([
            {
                kind: "weekdayRhythm",
                category: { categoryId: "1" },
                firstWeekday: 4,
                lastWeekday: 5,
                share: 0.75,
            },
        ]);
    });

    it("sums many small purchases", async () => {
        const days = ["2026-08-03", "2026-08-11", "2026-08-19", "2026-08-27"];
        for (let i = 0; i < 12; i++) {
            await add(days[i % 4]!, {
                name: i < 5 ? "Bäcker" : `Kiosk ${i}`,
                amount: 5,
            });
        }
        await add("2026-09-10", { amount: 100 });

        expect(ofKind(await patterns(), "smallPurchases")).toEqual([
            {
                kind: "smallPurchases",
                limit: 10,
                count: 12,
                total: 60,
                topName: "Bäcker",
            },
        ]);
    });

    it("ignores small purchases that are a tiny share of spending", async () => {
        for (let i = 0; i < 12; i++) {
            await add(`2026-09-${String(i + 1).padStart(2, "0")}`, {
                amount: 5,
            });
        }
        await add("2026-09-20", { amount: 2000 });

        expect(ofKind(await patterns(), "smallPurchases")).toEqual([]);
    });

    it("compares a category's spending per day with the window before", async () => {
        for (const day of ["2026-05-15", "2026-06-15", "2026-07-15"]) {
            await add(day, { categoryId: "2", amount: 100 });
            // Too little before to compare.
            await add(day, { categoryId: "3", amount: 10 });
        }
        for (const day of ["2026-08-15", "2026-09-15", "2026-10-15"]) {
            await add(day, { categoryId: "2", amount: 150 });
            await add(day, { categoryId: "3", amount: 100 });
        }

        // Aug 1–Oct 18 is 79 days, May–Jul 92.
        const drifts = ofKind(await patterns(), "categoryDrift");
        expect(drifts).toHaveLength(1);
        expect(drifts[0]?.category.categoryId).toBe("2");
        expect(drifts[0]?.change).toBeCloseTo(450 / 79 / (300 / 92) - 1, 2);
    });

    it("follows the selected month", async () => {
        for (const day of [
            "2026-06-01",
            "2026-06-08",
            "2026-06-15",
            "2026-06-22",
        ]) {
            await add(day, { name: "Kiosk" });
        }

        expect(ofKind(await patterns("2026-07"), "recurringName")).toEqual([
            { kind: "recurringName", name: "Kiosk", count: 4, average: 20 },
        ]);
        expect(ofKind(await patterns("2026-10"), "recurringName")).toEqual([]);
    });

    it("leaves out exceptional transactions", async () => {
        for (const day of [
            "2026-10-01",
            "2026-10-05",
            "2026-10-09",
            "2026-10-13",
        ]) {
            await add(day, { name: "Car", exceptional: true });
        }

        expect(await patterns()).toEqual([]);
    });
});
