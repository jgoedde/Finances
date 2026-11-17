import { beforeEach, describe, expect, it } from "vitest";
import { type Category, FALLBACK_CATEGORIES } from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

describe("categories", () => {
    let alice: Client;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    it("gives a new user the default categories and both fallback categories", async () => {
        const categories = await json<Category[]>(alice("/api/categories"));
        expect(categories).toHaveLength(12);
        expect(categories.filter((c) => c.kind === "expense")).toHaveLength(11);
        expect(categories.filter((c) => c.fallback)).toEqual([
            expect.objectContaining({
                id: FALLBACK_CATEGORIES.expense.id,
                kind: "expense",
                name: null,
            }),
            expect.objectContaining({
                id: FALLBACK_CATEGORIES.income.id,
                kind: "income",
                name: null,
            }),
        ]);
    });

    it("lists the fallback categories last and the rest by name", async () => {
        const categories = await json<Category[]>(alice("/api/categories"));
        const names = categories.map((c) => c.name);
        expect(names.slice(-2)).toEqual([null, null]);
        const named = names.slice(0, -2);
        expect(named).toEqual([...named].sort());
    });

    it("rejects a transaction whose category doesn't match its kind", async () => {
        for (const body of [
            transactionBody({ kind: "income", categoryId: "2" }),
            transactionBody({
                kind: "expense",
                categoryId: FALLBACK_CATEGORIES.income.id,
            }),
        ]) {
            const response = await alice("/api/transactions/t1", {
                method: "PUT",
                body,
            });
            expect(response.status).toBe(422);
            expect(await json(response)).toEqual({
                error: "category_kind_mismatch",
            });
        }
        const income = await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({
                kind: "income",
                categoryId: FALLBACK_CATEGORIES.income.id,
            }),
        });
        expect(income.status).toBe(200);
    });
});
