import { beforeEach, describe, expect, it } from "vitest";
import {
    FALLBACK_CATEGORIES,
    type Transaction,
    type TransactionSearchPage,
} from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

describe("transactions", () => {
    let alice: Client;
    let bob: Client;
    let request: Awaited<ReturnType<typeof createTestApp>>["request"];

    beforeEach(async () => {
        const app = await createTestApp();
        request = app.request;
        alice = (await app.signUp("alice")).client;
        bob = (await app.signUp("bob")).client;
    });

    function list(client: Client) {
        return json<Transaction[]>(
            client(`/api/transactions?from=0&to=${Date.now() + 1000}`),
        );
    }

    it("requires a session", async () => {
        expect((await request("/api/transactions?from=0&to=1")).status).toBe(
            401,
        );
    });

    it("keeps users' data apart, even with the same id", async () => {
        await alice("/api/transactions/same-id", {
            method: "PUT",
            body: transactionBody({ counterparty: "Alice" }),
        });

        expect((await bob("/api/transactions/same-id")).status).toBe(404);
        expect(await list(bob)).toEqual([]);

        await bob("/api/transactions/same-id", {
            method: "PUT",
            body: transactionBody({ counterparty: "Bob" }),
        });
        await bob("/api/transactions/same-id", { method: "DELETE" });

        const own = await json<Transaction>(alice("/api/transactions/same-id"));
        expect(own.counterparty).toBe("Alice");
    });

    it("treats a replayed PUT as one transaction, last write wins", async () => {
        const put = (name: string) =>
            alice("/api/transactions/t1", {
                method: "PUT",
                body: transactionBody({ counterparty: name }),
            });

        expect((await put("first")).status).toBe(200);
        expect((await put("first")).status).toBe(200);
        await put("second");

        const rows = await list(alice);
        expect(rows).toHaveLength(1);
        expect(rows[0]?.counterparty).toBe("second");
    });

    it("ignores writes to a deleted transaction", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody(),
        });
        expect(
            (await alice("/api/transactions/t1", { method: "DELETE" })).status,
        ).toBe(204);
        expect(
            (await alice("/api/transactions/t1", { method: "DELETE" })).status,
        ).toBe(204);

        const late = await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ counterparty: "late edit" }),
        });
        expect(late.status).toBe(204);
        expect((await alice("/api/transactions/t1")).status).toBe(404);
    });

    it("rejects unknown categories and invalid payloads", async () => {
        const unknown = await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ categoryId: "999" }),
        });
        expect(unknown.status).toBe(422);

        const negative = await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ amount: -1 }),
        });
        expect(negative.status).toBe(400);
    });

    describe("attached expenses", () => {
        async function put(
            id: string,
            overrides: Record<string, unknown> = {},
            client: Client = alice,
        ) {
            return client(`/api/transactions/${id}`, {
                method: "PUT",
                body: transactionBody({ date: 1000, ...overrides }),
            });
        }

        function get(id: string) {
            return json<Transaction>(alice(`/api/transactions/${id}`));
        }

        it("attaches an expense to a main expense", async () => {
            await put("main");
            expect((await put("tip", { mainExpenseId: "main" })).status).toBe(
                200,
            );

            expect((await get("tip")).mainExpenseId).toBe("main");
            expect((await get("main")).mainExpenseId).toBeNull();
            expect(
                Object.fromEntries(
                    (await list(alice)).map((t) => [t.id, t.mainExpenseId]),
                ),
            ).toEqual({ main: null, tip: "main" });
        });
        it("stores a reference to a missing or deleted main expense as none", async () => {
            await put("main");
            await alice("/api/transactions/main", { method: "DELETE" });

            expect((await put("tip", { mainExpenseId: "main" })).status).toBe(
                200,
            );
            expect(
                (await put("shipping", { mainExpenseId: "unknown" })).status,
            ).toBe(200);

            expect((await get("tip")).mainExpenseId).toBeNull();
            expect((await get("shipping")).mainExpenseId).toBeNull();
        });

        it("can't attach to another user's expense", async () => {
            await put("bobs", {}, bob);

            await put("tip", { mainExpenseId: "bobs" });

            expect((await get("tip")).mainExpenseId).toBeNull();
        });
        it("rejects references the model forbids", async () => {
            await put("main");
            await put("tip", { mainExpenseId: "main" });
            await put("other");
            await put("salary", {
                kind: "income",
                categoryId: FALLBACK_CATEGORIES.income.id,
            });

            const rejected = {
                income: await put("refund", {
                    kind: "income",
                    categoryId: FALLBACK_CATEGORIES.income.id,
                    mainExpenseId: "main",
                }),
                self: await put("main", { mainExpenseId: "main" }),
                toAttached: await put("other", { mainExpenseId: "tip" }),
                toIncome: await put("other", { mainExpenseId: "salary" }),
                mainWithAttached: await put("main", { mainExpenseId: "other" }),
            };
            for (const response of Object.values(rejected)) {
                expect(response.status).toBe(422);
                expect(await response.json()).toEqual({
                    error: "invalid_main_expense",
                });
            }
        });

        it("rejects turning a main expense with attached expenses into an income", async () => {
            await put("main");
            await put("tip", { mainExpenseId: "main" });

            const response = await put("main", {
                kind: "income",
                categoryId: FALLBACK_CATEGORIES.income.id,
            });

            expect(response.status).toBe(422);
            expect(await response.json()).toEqual({
                error: "main_expense_kind",
            });
            expect((await get("main")).kind).toBe("expense");
        });
        it("keeps attached expenses on their main expense's date", async () => {
            await put("main", { date: 1000 });
            await put("tip", { date: 5000, mainExpenseId: "main" });
            expect((await get("tip")).date).toBe(1000);

            await put("main", { date: 2000 });
            expect((await get("tip")).date).toBe(2000);
        });

        it("detaches attached expenses when their main expense is deleted", async () => {
            await put("main");
            await put("tip", { mainExpenseId: "main" });

            await alice("/api/transactions/main", { method: "DELETE" });

            expect((await get("tip")).mainExpenseId).toBeNull();
        });
    });

    describe("search", () => {
        function search(query: string, client: Client = alice) {
            return json<TransactionSearchPage>(
                client(`/api/transactions/search?${query}`),
            );
        }

        async function put(id: string, overrides: Record<string, unknown>) {
            await alice(`/api/transactions/${id}`, {
                method: "PUT",
                body: transactionBody(overrides),
            });
        }

        it("pages newest first with a (date, id) cursor", async () => {
            await put("a", { date: 1000 });
            await put("b", { date: 2000 });
            await put("c", { date: 2000 });
            await put("d", { date: 3000 });

            const first = await search("limit=2");
            expect(first.items.map((t) => t.id)).toEqual(["d", "c"]);
            expect(first.nextCursor).toBe("2000:c");

            const second = await search(`limit=2&cursor=${first.nextCursor}`);
            expect(second.items.map((t) => t.id)).toEqual(["b", "a"]);
            expect(second.nextCursor).toBeNull();
        });

        it("matches counterparty and description, ignoring ASCII case", async () => {
            await put("counterparty", { counterparty: "Brotladen" });
            await put("desc", {
                counterparty: "Markt",
                description: "frisches BROT",
            });
            await put("other", { counterparty: "Tanken" });

            const page = await search(`q=${encodeURIComponent("brot")}`);
            expect(page.items.map((t) => t.id).sort()).toEqual([
                "counterparty",
                "desc",
            ]);
        });

        it("treats LIKE wildcards literally", async () => {
            await put("percent", { counterparty: "50% Rabatt" });
            await put("plain", { counterparty: "500 Rabatt" });

            const page = await search(`q=${encodeURIComponent("0%")}`);
            expect(page.items.map((t) => t.id)).toEqual(["percent"]);
        });

        it("returns the main expenses of attached results that aren't results themselves", async () => {
            await put("restaurant", { counterparty: "Pizzeria" });
            await put("tip", {
                counterparty: "Trinkgeld",
                mainExpenseId: "restaurant",
            });
            await put("shop", { counterparty: "Shop" });
            await put("shipping", {
                counterparty: "Versand Shop",
                mainExpenseId: "shop",
            });

            const tips = await search(`q=${encodeURIComponent("Trinkgeld")}`);
            expect(tips.items.map((t) => t.id)).toEqual(["tip"]);
            expect(tips.mainExpenses).toEqual([
                expect.objectContaining({
                    id: "restaurant",
                    counterparty: "Pizzeria",
                }),
            ]);

            const shop = await search(`q=${encodeURIComponent("Shop")}`);
            expect(shop.items.map((t) => t.id).sort()).toEqual([
                "shipping",
                "shop",
            ]);
            expect(shop.mainExpenses).toEqual([]);
        });

        it("filters by olderThan and by user", async () => {
            await put("old", { date: 1000 });
            await put("new", { date: 5000 });

            const page = await search("olderThan=5000");
            expect(page.items.map((t) => t.id)).toEqual(["old"]);
            expect((await search("", bob)).items).toEqual([]);
        });

        it("rejects a malformed cursor", async () => {
            expect(
                (await alice("/api/transactions/search?cursor=nope")).status,
            ).toBe(400);
        });
    });
});
