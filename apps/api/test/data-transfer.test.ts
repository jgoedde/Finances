import { beforeEach, describe, expect, it } from "vitest";
import type { DataExport, ImportResult, Transaction } from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

describe("data transfer", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let alice: Client;

    beforeEach(async () => {
        app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    function upload(client: Client, body: string, { replace = false } = {}) {
        return client(`/api/data/import${replace ? "?replace=true" : ""}`, {
            method: "POST",
            body,
        });
    }

    async function list<T>(client: Client, path: string) {
        return json<T[]>(client(path));
    }

    /**
     * Another account's export: two transactions and only their category
     * (`transactionBody`'s default, "2").
     */
    async function sampleExport(): Promise<string> {
        const carol = (await app.signUp("carol")).client;
        for (const id of ["t1", "t2"]) {
            await carol(`/api/transactions/${id}`, {
                method: "PUT",
                body: transactionBody(),
            });
        }
        const exported = await json<DataExport>(carol("/api/data/export"));
        return JSON.stringify({
            ...exported,
            categories: exported.categories.filter((c) => c.id === "2"),
        });
    }

    function fixedCostBody(overrides: Record<string, unknown> = {}) {
        return JSON.stringify({
            name: "Rent",
            description: null,
            initialAmount: 500,
            currency: "EUR",
            interval: "monthly",
            categoryId: "1",
            active: true,
            startDate: "2026-01-01",
            endDate: null,
            ...overrides,
        });
    }

    it("round-trips an export into another account", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ categoryId: "3" }),
        });
        await alice("/api/fixed-costs", {
            method: "POST",
            body: fixedCostBody({
                priceChanges: [
                    { date: "2026-04-01", amount: 520 },
                    { date: "2026-09-01", amount: 550 },
                ],
            }),
        });
        const exported = await json<DataExport>(alice("/api/data/export"));

        const bob = (await app.signUp("bob")).client;
        expect((await upload(bob, JSON.stringify(exported))).status).toBe(200);

        const reexported = await json<DataExport>(bob("/api/data/export"));
        expect(reexported.version).toBe(5);
        expect(reexported.fixedCosts[0]?.priceChanges).toHaveLength(2);
        expect({ ...reexported, exportedAt: "" }).toEqual({
            ...exported,
            exportedAt: "",
        });
    });

    it("imports a version 4 export, whose fixed cost categories have no hue", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const v4 = {
            ...exported,
            version: 4,
            fixedCostCategories: [
                { id: "1", name: "Miete", description: null },
                { id: "custom", name: "Eigene", description: null },
            ],
        };
        expect((await upload(alice, JSON.stringify(v4))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.fixedCostCategories).toEqual([
            { id: "1", name: "Miete", description: null, hue: 30 },
            { id: "custom", name: "Eigene", description: null, hue: 138 },
        ]);
    });

    it("imports a version 3 export, whose fixed costs have a single amount", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const fixedCost = {
            ...(JSON.parse(fixedCostBody()) as Record<string, unknown>),
            id: "f1",
            initialAmount: undefined,
            amount: 480,
        };
        const v3 = { ...exported, version: 3, fixedCosts: [fixedCost] };
        expect((await upload(alice, JSON.stringify(v3))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.fixedCosts).toEqual([
            {
                ...fixedCost,
                amount: undefined,
                initialAmount: 480,
                priceChanges: [],
            },
        ]);
    });

    it("imports a version 2 export, whose transactions have no location", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const transaction = JSON.parse(transactionBody()) as Transaction;
        const v2 = {
            ...exported,
            version: 2,
            transactions: [{ ...transaction, id: "t1", location: undefined }],
        };
        expect((await upload(alice, JSON.stringify(v2))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.version).toBe(5);
        expect(reexported.transactions).toEqual([{ ...transaction, id: "t1" }]);
    });

    it("rejects price changes outside a fixed cost's start and end date", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const fixedCost = {
            ...(JSON.parse(fixedCostBody()) as Record<string, unknown>),
            id: "f1",
            priceChanges: [{ date: "2026-01-01", amount: 520 }],
        };
        const response = await upload(
            alice,
            JSON.stringify({ ...exported, fixedCosts: [fixedCost] }),
        );
        expect(response.status).toBe(422);
        expect(await json(response)).toEqual({
            error: "price_change_out_of_range",
        });
        expect(await list(alice, "/api/fixed-costs")).toEqual([]);
    });

    it("rejects a version 1 export", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const v1Transaction = transactionBody({
            counterparty: undefined,
            location: undefined,
            name: "Bäcker",
        });
        const v1 = {
            ...exported,
            version: 1,
            transactions: [{ ...JSON.parse(v1Transaction), id: "t1" }],
        };
        const response = await upload(alice, JSON.stringify(v1));
        expect(response.status).toBe(400);
        expect(await json(response)).toMatchObject({
            error: "invalid_request",
        });
    });

    it("only imports into an account without data", async () => {
        await alice("/api/transactions/a1", {
            method: "PUT",
            body: transactionBody(),
        });
        expect((await upload(alice, await sampleExport())).status).toBe(409);
    });

    it("replaces all data when asked to", async () => {
        await alice("/api/transactions/a1", {
            method: "PUT",
            body: transactionBody(),
        });
        const exported = await sampleExport();
        const first = await upload(alice, exported, { replace: true });
        expect(await json<ImportResult>(first)).toEqual({
            categories: 1,
            fixedCosts: 0,
            transactions: 2,
        });
        // Again: the same ids were just replaced, which must not block them.
        const again = await upload(alice, exported, { replace: true });
        expect(again.status).toBe(200);

        const transactions = await list<Transaction>(
            alice,
            `/api/transactions?from=0&to=${Date.now()}`,
        );
        expect(transactions.map((t) => t.id).sort()).toEqual(["t1", "t2"]);
        expect(await list(alice, "/api/categories")).toHaveLength(1);
    });

    it("keeps the data when a replacing import is invalid", async () => {
        await alice("/api/transactions/a1", {
            method: "PUT",
            body: transactionBody(),
        });
        const response = await upload(
            alice,
            JSON.stringify({ format: "other" }),
            { replace: true },
        );
        expect(response.status).toBe(400);
        expect(
            await list(
                alice,
                `/api/transactions?from=0&to=${Date.now() + 1000}`,
            ),
        ).toHaveLength(1);
    });

    it("rejects invalid exports without changing anything", async () => {
        const invalid = await upload(
            alice,
            JSON.stringify({ format: "other" }),
        );
        expect(invalid.status).toBe(400);
        expect(await json(invalid)).toMatchObject({
            error: "invalid_request",
            issues: expect.any(Array) as unknown,
        });
        const notJson = await upload(alice, "not json");
        expect(notJson.status).toBe(400);
        expect(await json(notJson)).toEqual({ error: "invalid_request" });

        const exported = await json<DataExport>(alice("/api/data/export"));
        const broken = {
            ...exported,
            transactions: [
                {
                    ...JSON.parse(transactionBody()),
                    id: "t1",
                    categoryId: "999",
                },
            ],
        };
        const unknownCategory = await upload(alice, JSON.stringify(broken));
        expect(unknownCategory.status).toBe(422);
        expect(await list(alice, "/api/categories")).toHaveLength(10);
    });

    it("leaves other users alone", async () => {
        const bob = (await app.signUp("bob")).client;
        await upload(alice, await sampleExport());
        expect(await list(bob, "/api/categories")).toHaveLength(10);
        expect(
            await list(bob, `/api/transactions?from=0&to=${Date.now()}`),
        ).toEqual([]);
    });
});
