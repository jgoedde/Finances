import { beforeEach, describe, expect, it } from "vitest";
import {
    type Category,
    type DataExport,
    FALLBACK_CATEGORIES,
    type ImportResult,
    type Transaction,
} from "@finances/shared";
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
     * (`transactionBody`'s default, "2") besides the fallback categories.
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
            categories: exported.categories.filter(
                (c) => c.id === "2" || c.fallback,
            ),
        });
    }

    /**
     * The categories as exports before version 6 had them.
     */
    function v5Categories(exported: DataExport) {
        return exported.categories.flatMap((c) =>
            c.fallback
                ? []
                : [
                      {
                          id: c.id,
                          name: c.name,
                          color: c.color,
                          iconName: c.iconName,
                      },
                  ],
        );
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
        await alice("/api/transactions/t2", {
            method: "PUT",
            body: transactionBody({
                kind: "income",
                categoryId: FALLBACK_CATEGORIES.income.id,
            }),
        });
        await alice("/api/transactions/t3", {
            method: "PUT",
            body: transactionBody({ mainExpenseId: "t1" }),
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
        expect(reexported.version).toBe(7);
        expect(reexported.fixedCosts[0]?.priceChanges).toHaveLength(2);
        expect(
            reexported.transactions.find((t) => t.id === "t3")?.mainExpenseId,
        ).toBe("t1");
        expect(reexported.categories).toContainEqual(
            FALLBACK_CATEGORIES.income,
        );
        expect({ ...reexported, exportedAt: "" }).toEqual({
            ...exported,
            exportedAt: "",
        });
    });

    it("imports a version 6 export, whose transactions have no main expense", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const transaction = JSON.parse(transactionBody()) as Transaction;
        const v6 = {
            ...exported,
            version: 6,
            transactions: [{ ...transaction, id: "t1" }],
        };
        expect((await upload(alice, JSON.stringify(v6))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.transactions).toEqual([
            { ...transaction, id: "t1", mainExpenseId: null },
        ]);
    });

    it("imports main expense references with the save rules: invalid or dangling ones are dropped, attached expenses take the main expense's date", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const expense = (id: string, overrides: Record<string, unknown>) => ({
            ...(JSON.parse(transactionBody()) as Transaction),
            id,
            mainExpenseId: null,
            ...overrides,
        });
        const income = {
            kind: "income",
            categoryId: FALLBACK_CATEGORIES.income.id,
        };
        const transactions = [
            expense("main", { date: 1_000 }),
            expense("attached", { date: 2_000, mainExpenseId: "main" }),
            expense("dangling", { mainExpenseId: "missing" }),
            expense("self", { mainExpenseId: "self" }),
            expense("nested", { mainExpenseId: "attached" }),
            expense("income", income),
            expense("on-income", { mainExpenseId: "income" }),
            expense("attached-income", { ...income, mainExpenseId: "main" }),
        ];
        const response = await upload(
            alice,
            JSON.stringify({ ...exported, transactions }),
        );
        expect(response.status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        const byId = new Map(reexported.transactions.map((t) => [t.id, t]));
        expect(byId.get("attached")).toMatchObject({
            mainExpenseId: "main",
            date: 1_000,
        });
        for (const id of [
            "main",
            "dangling",
            "self",
            "nested",
            "on-income",
            "attached-income",
        ]) {
            expect(byId.get(id)?.mainExpenseId, id).toBeNull();
        }
    });

    it("keeps a reference to a main expense whose own reference is dropped, as saving would", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const expense = (id: string, overrides: Record<string, unknown>) => ({
            ...(JSON.parse(transactionBody()) as Transaction),
            id,
            mainExpenseId: null,
            ...overrides,
        });
        const transactions = [
            expense("tip", { date: 2_000, mainExpenseId: "meal" }),
            expense("meal", { date: 1_000, mainExpenseId: "missing" }),
        ];
        const response = await upload(
            alice,
            JSON.stringify({ ...exported, transactions }),
        );
        expect(response.status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        const byId = new Map(reexported.transactions.map((t) => [t.id, t]));
        expect(byId.get("meal")?.mainExpenseId).toBeNull();
        expect(byId.get("tip")).toMatchObject({
            mainExpenseId: "meal",
            date: 1_000,
        });
    });

    it("imports a version 5 export like the migration: expense categories, both fallback categories, incomes on the income one", async () => {
        const v5 = {
            format: "finances-export",
            version: 5,
            exportedAt: new Date().toISOString(),
            categories: [
                { id: "1", name: "Essen", color: "#000001", iconName: "a" },
                // An ordinary category, despite the name.
                { id: "2", name: "Sonstiges", color: "#000002", iconName: "b" },
            ],
            fixedCostCategories: [],
            fixedCosts: [],
            transactions: [
                {
                    ...JSON.parse(transactionBody({ categoryId: "1" })),
                    id: "e1",
                },
                {
                    ...JSON.parse(
                        transactionBody({ kind: "income", categoryId: "2" }),
                    ),
                    id: "i1",
                },
            ],
        };
        expect((await upload(alice, JSON.stringify(v5))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.categories).toEqual<Category[]>([
            {
                id: "1",
                name: "Essen",
                color: "#000001",
                iconName: "a",
                kind: "expense",
                fallback: false,
            },
            {
                id: "2",
                name: "Sonstiges",
                color: "#000002",
                iconName: "b",
                kind: "expense",
                fallback: false,
            },
            FALLBACK_CATEGORIES.expense,
            FALLBACK_CATEGORIES.income,
        ]);
        expect(
            Object.fromEntries(
                reexported.transactions.map((t) => [t.id, t.categoryId]),
            ),
        ).toEqual({ e1: "1", i1: FALLBACK_CATEGORIES.income.id });
    });

    it("rejects an export without exactly one fallback category per kind", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const response = await upload(
            alice,
            JSON.stringify({
                ...exported,
                categories: exported.categories.filter(
                    (c) => c.id !== FALLBACK_CATEGORIES.income.id,
                ),
            }),
        );
        expect(response.status).toBe(400);
        expect(await list(alice, "/api/categories")).toHaveLength(12);
    });

    it("rejects a transaction whose category doesn't match its kind", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const response = await upload(
            alice,
            JSON.stringify({
                ...exported,
                transactions: [
                    {
                        ...JSON.parse(
                            transactionBody({
                                kind: "income",
                                categoryId: "2",
                            }),
                        ),
                        id: "t1",
                        mainExpenseId: null,
                    },
                ],
            }),
        );
        expect(response.status).toBe(422);
        expect(await json(response)).toEqual({
            error: "category_kind_mismatch",
        });
    });

    it("imports a version 4 export, whose fixed cost categories have no hue", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const v4 = {
            ...exported,
            categories: v5Categories(exported),
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
        const v3 = {
            ...exported,
            categories: v5Categories(exported),
            version: 3,
            fixedCosts: [fixedCost],
        };
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
            categories: v5Categories(exported),
            version: 2,
            transactions: [{ ...transaction, id: "t1", location: undefined }],
        };
        expect((await upload(alice, JSON.stringify(v2))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.version).toBe(7);
        expect(reexported.transactions).toEqual([
            { ...transaction, id: "t1", mainExpenseId: null },
        ]);
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
            categories: 3,
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
        expect(await list(alice, "/api/categories")).toHaveLength(3);
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
                    mainExpenseId: null,
                    categoryId: "999",
                },
            ],
        };
        const unknownCategory = await upload(alice, JSON.stringify(broken));
        expect(unknownCategory.status).toBe(422);
        expect(await list(alice, "/api/categories")).toHaveLength(12);
    });

    it("leaves other users alone", async () => {
        const bob = (await app.signUp("bob")).client;
        await upload(alice, await sampleExport());
        expect(await list(bob, "/api/categories")).toHaveLength(12);
        expect(
            await list(bob, `/api/transactions?from=0&to=${Date.now()}`),
        ).toEqual([]);
    });
});
