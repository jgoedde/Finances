import { beforeEach, describe, expect, it } from "vitest";
import type {
    FixedCost,
    FixedCostCategory,
    PriceChange,
} from "@finances/shared";
import { type Client, createTestApp, json } from "./test-app.ts";

describe("fixed costs", () => {
    let alice: Client;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    function create(overrides: Record<string, unknown> = {}) {
        return alice("/api/fixed-costs", {
            method: "POST",
            body: JSON.stringify({
                name: "Rent",
                description: null,
                initialAmount: 500,
                currency: "EUR",
                interval: "monthly",
                categoryId: "1",
                active: true,
                startDate: "2026-01-01",
                endDate: "2026-12-31",
                ...overrides,
            }),
        });
    }

    async function createWith(priceChanges: PriceChange[]) {
        const response = await create({ priceChanges });
        expect(response.status).toBe(201);
        return json<FixedCost>(response);
    }

    function patch(id: string, body: Record<string, unknown>) {
        return alice(`/api/fixed-costs/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }

    it("creates a fixed cost without price changes by default", async () => {
        const created = await json<FixedCost>(create());
        expect(created.priceChanges).toEqual([]);
        expect(created.initialAmount).toBe(500);
    });

    it("serves price changes sorted by date in the list and the detail", async () => {
        const created = await createWith([
            { date: "2026-09-01", amount: 550 },
            { date: "2026-04-01", amount: 520 },
        ]);
        const sorted = [
            { date: "2026-04-01", amount: 520 },
            { date: "2026-09-01", amount: 550 },
        ];

        expect(created.priceChanges).toEqual(sorted);
        const detail = await json<FixedCost>(
            alice(`/api/fixed-costs/${created.id}`),
        );
        expect(detail.priceChanges).toEqual(sorted);
        const list = await json<FixedCost[]>(alice("/api/fixed-costs"));
        expect(list.map((it) => it.priceChanges)).toEqual([sorted]);
    });

    it("allows a price change equal to the previous amount", async () => {
        const response = await create({
            priceChanges: [{ date: "2026-04-01", amount: 500 }],
        });
        expect(response.status).toBe(201);
    });

    it("rejects price changes on the same day", async () => {
        const response = await create({
            priceChanges: [
                { date: "2026-04-01", amount: 520 },
                { date: "2026-04-01", amount: 530 },
            ],
        });
        expect(response.status).toBe(400);
        expect(await json(alice("/api/fixed-costs"))).toEqual([]);
    });

    it("only accepts price changes after the start date and on or before the end date", async () => {
        for (const date of ["2025-12-31", "2026-01-01", "2027-01-01"]) {
            const response = await create({
                priceChanges: [{ date, amount: 520 }],
            });
            expect(response.status).toBe(422);
            expect(await json(response)).toEqual({
                error: "price_change_out_of_range",
            });
        }
        expect(await json(alice("/api/fixed-costs"))).toEqual([]);

        for (const date of ["2026-01-02", "2026-12-31"]) {
            await createWith([{ date, amount: 520 }]);
        }
        const open = await create({
            endDate: null,
            priceChanges: [{ date: "2099-01-01", amount: 520 }],
        });
        expect(open.status).toBe(201);
    });

    it("replaces all price changes when a patch has them", async () => {
        const { id } = await createWith([
            { date: "2026-04-01", amount: 520 },
            { date: "2026-09-01", amount: 550 },
        ]);

        const replaced = await patch(id, {
            priceChanges: [{ date: "2026-06-01", amount: 600 }],
        });
        expect(replaced.status).toBe(200);
        expect((await json<FixedCost>(replaced)).priceChanges).toEqual([
            { date: "2026-06-01", amount: 600 },
        ]);

        const cleared = await json<FixedCost>(patch(id, { priceChanges: [] }));
        expect(cleared.priceChanges).toEqual([]);
    });

    it("keeps the price changes when a patch has none", async () => {
        const { id } = await createWith([{ date: "2026-04-01", amount: 520 }]);

        const patched = await json<FixedCost>(
            patch(id, { initialAmount: 480, name: "Flat" }),
        );

        expect(patched).toMatchObject({
            name: "Flat",
            initialAmount: 480,
            priceChanges: [{ date: "2026-04-01", amount: 520 }],
        });
    });

    it("rejects moving the start or end date past a price change", async () => {
        const { id } = await createWith([{ date: "2026-04-01", amount: 520 }]);

        for (const body of [
            { startDate: "2026-04-01" },
            { endDate: "2026-03-31" },
            {
                startDate: "2026-02-01",
                priceChanges: [{ date: "2026-01-15", amount: 520 }],
            },
        ]) {
            const response = await patch(id, body);
            expect(response.status).toBe(422);
            expect(await json(response)).toEqual({
                error: "price_change_out_of_range",
            });
        }

        // Nothing was written.
        expect(
            await json<FixedCost>(alice(`/api/fixed-costs/${id}`)),
        ).toMatchObject({
            startDate: "2026-01-01",
            endDate: "2026-12-31",
            priceChanges: [{ date: "2026-04-01", amount: 520 }],
        });

        const moved = await patch(id, {
            startDate: "2026-03-31",
            endDate: "2026-04-01",
        });
        expect(moved.status).toBe(200);
    });

    it("rejects duplicate dates in a patch", async () => {
        const { id } = await createWith([]);
        const response = await patch(id, {
            priceChanges: [
                { date: "2026-04-01", amount: 520 },
                { date: "2026-04-01", amount: 520 },
            ],
        });
        expect(response.status).toBe(400);
    });

    it("deletes the price changes with the fixed cost", async () => {
        const { id } = await createWith([{ date: "2026-04-01", amount: 520 }]);

        expect(
            (await alice(`/api/fixed-costs/${id}`, { method: "DELETE" }))
                .status,
        ).toBe(204);

        expect(await json(alice("/api/fixed-costs"))).toEqual([]);
    });

    it("answers 404 for a patch of an unknown fixed cost", async () => {
        const response = await patch("nope", { priceChanges: [] });
        expect(response.status).toBe(404);
    });
});

describe("fixed cost categories", () => {
    let alice: Client;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    function patch(id: string, body: Record<string, unknown>) {
        return alice(`/api/fixed-cost-categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }

    it("seeds a distinct hue for every default category", async () => {
        const categories = await json<FixedCostCategory[]>(
            alice("/api/fixed-cost-categories"),
        );
        const hues = categories.map((it) => it.hue);
        expect(new Set(hues).size).toBe(categories.length);
    });

    it("changes a category's hue", async () => {
        const response = await patch("1", { hue: 200 });
        expect(response.status).toBe(200);
        expect(await json<FixedCostCategory>(response)).toMatchObject({
            id: "1",
            hue: 200,
        });
        const categories = await json<FixedCostCategory[]>(
            alice("/api/fixed-cost-categories"),
        );
        expect(categories.find((it) => it.id === "1")?.hue).toBe(200);
    });

    it("rejects a hue outside 0 to 359", async () => {
        expect((await patch("1", { hue: 360 })).status).toBe(400);
        expect((await patch("1", { hue: 12.5 })).status).toBe(400);
    });

    it("answers 404 for an unknown category", async () => {
        expect((await patch("nope", { hue: 10 })).status).toBe(404);
    });
});
