import { beforeEach, describe, expect, it } from "vitest";
import {
    type Category,
    FALLBACK_CATEGORIES,
    type Transaction,
} from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

describe("categories", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let alice: Client;

    beforeEach(async () => {
        app = await createTestApp();
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

    it("creates a category of the chosen kind", async () => {
        const response = await alice("/api/categories", {
            method: "POST",
            body: JSON.stringify({
                kind: "income",
                name: "Rückzahlung",
                color: "#3f8f6b",
                iconName: "undo-2",
            }),
        });
        expect(response.status).toBe(201);
        const created = await json<Category>(response);
        expect(created).toEqual({
            id: expect.any(String) as unknown,
            kind: "income",
            fallback: false,
            name: "Rückzahlung",
            color: "#3f8f6b",
            iconName: "undo-2",
        });
        const categories = await json<Category[]>(alice("/api/categories"));
        expect(categories).toContainEqual(created);
    });

    it("rejects a name the kind already has, but not one the other kind has", async () => {
        const create = (kind: string, name: string) =>
            alice("/api/categories", {
                method: "POST",
                body: JSON.stringify({
                    kind,
                    name,
                    color: "#2c4875",
                    iconName: "shopping-basket",
                }),
            });
        const duplicate = await create("expense", " Einkäufe ");
        expect(duplicate.status).toBe(409);
        expect(await json(duplicate)).toEqual({ error: "category_name_taken" });
        // Same color and icon as the default "Einkäufe".
        expect((await create("income", "Einkäufe")).status).toBe(201);
    });

    it("renames, recolors and re-icons a category", async () => {
        const patch = (body: object) =>
            alice("/api/categories/2", {
                method: "PATCH",
                body: JSON.stringify(body),
            });
        expect((await patch({ name: "Auswärts essen" })).status).toBe(409);

        const response = await patch({
            name: "Lebensmittel",
            color: "#00202e",
            iconName: "apple",
        });
        expect(response.status).toBe(200);
        expect(await json(response)).toEqual({
            id: "2",
            kind: "expense",
            fallback: false,
            name: "Lebensmittel",
            color: "#00202e",
            iconName: "apple",
        });
        // Keeping its own name is no conflict.
        expect((await patch({ name: "Lebensmittel" })).status).toBe(200);
    });

    it("only lets the fallback category change its color and icon", async () => {
        const path = `/api/categories/${FALLBACK_CATEGORIES.expense.id}`;
        const renamed = await alice(path, {
            method: "PATCH",
            body: JSON.stringify({ name: "Diverses" }),
        });
        expect(renamed.status).toBe(422);
        expect(await json(renamed)).toEqual({ error: "fallback_category" });

        const recolored = await alice(path, {
            method: "PATCH",
            body: JSON.stringify({ color: "#123456", iconName: "box" }),
        });
        expect(await json(recolored)).toEqual(
            expect.objectContaining({
                name: null,
                color: "#123456",
                iconName: "box",
            }),
        );
    });

    it("deletes an unused category without asking for a target", async () => {
        expect(await json(alice("/api/categories/3/usage"))).toEqual({
            transactions: 0,
        });
        const response = await alice("/api/categories/3", {
            method: "DELETE",
        });
        expect(response.status).toBe(204);
        const categories = await json<Category[]>(alice("/api/categories"));
        expect(categories.map((c) => c.id)).not.toContain("3");
    });

    it("moves the transactions of a deleted category to the target of the same kind", async () => {
        for (const id of ["t1", "t2"]) {
            await alice(`/api/transactions/${id}`, {
                method: "PUT",
                body: transactionBody({ categoryId: "2" }),
            });
        }
        expect(await json(alice("/api/categories/2/usage"))).toEqual({
            transactions: 2,
        });

        const remove = (moveTo?: string) =>
            alice(
                `/api/categories/2${moveTo === undefined ? "" : `?moveTo=${moveTo}`}`,
                { method: "DELETE" },
            );
        const withoutTarget = await remove();
        expect(withoutTarget.status).toBe(409);
        expect(await json(withoutTarget)).toEqual({
            error: "category_in_use",
        });
        const otherKind = await remove(FALLBACK_CATEGORIES.income.id);
        expect(otherKind.status).toBe(422);
        expect(await json(otherKind)).toEqual({
            error: "category_kind_mismatch",
        });
        expect((await remove("2")).status).toBe(422);
        expect((await remove("missing")).status).toBe(422);

        expect((await remove(FALLBACK_CATEGORIES.expense.id)).status).toBe(204);
        for (const id of ["t1", "t2"]) {
            const transaction = await json<Transaction>(
                alice(`/api/transactions/${id}`),
            );
            expect(transaction.categoryId).toBe(FALLBACK_CATEGORIES.expense.id);
        }
        expect((await alice("/api/categories/2/usage")).status).toBe(404);
    });

    it("never deletes a fallback category", async () => {
        const response = await alice(
            `/api/categories/${FALLBACK_CATEGORIES.expense.id}`,
            { method: "DELETE" },
        );
        expect(response.status).toBe(422);
        expect(await json(response)).toEqual({ error: "fallback_category" });
    });

    it("keeps other users' categories out of reach", async () => {
        const { client: bob } = await app.signUp("bob");
        const created = await json<Category>(
            alice("/api/categories", {
                method: "POST",
                body: JSON.stringify({
                    kind: "expense",
                    name: "Haustier",
                    color: "#8a508f",
                    iconName: "paw-print",
                }),
            }),
        );
        const path = `/api/categories/${created.id}`;
        expect((await bob(`${path}/usage`)).status).toBe(404);
        expect(
            (
                await bob(path, {
                    method: "PATCH",
                    body: JSON.stringify({ name: "Hund" }),
                })
            ).status,
        ).toBe(404);
        expect((await bob(path, { method: "DELETE" })).status).toBe(404);
        // Alice's categories are no targets for Bob's.
        await bob("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ categoryId: "3" }),
        });
        const foreignTarget = await bob(
            `/api/categories/3?moveTo=${created.id}`,
            { method: "DELETE" },
        );
        expect(await json(foreignTarget)).toEqual({
            error: "unknown_category",
        });
        const bobs = await json<Category[]>(bob("/api/categories"));
        expect(bobs.map((c) => c.name)).not.toContain("Haustier");
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
