import { beforeEach, describe, expect, it } from "vitest";
import type { Category, DefaultCategory } from "@finances/shared";
import { type Client, createTestApp, json } from "./test-app.ts";

describe("default categories", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let admin: Client;

    beforeEach(async () => {
        app = await createTestApp();
        admin = (await app.signUp("admin", "admin")).client;
    });

    const list = (client = admin) =>
        json<DefaultCategory[]>(client("/api/admin/default-categories"));

    it("starts with the ten expense categories new users got before", async () => {
        const defaults = await list();
        expect(defaults).toHaveLength(10);
        expect(defaults.every((d) => d.kind === "expense")).toBe(true);
        expect(defaults).toContainEqual({
            id: "2",
            kind: "expense",
            name: "Einkäufe",
            color: "#2c4875",
            iconName: "shopping-basket",
        });
    });

    const create = (body: Record<string, unknown>, client = admin) =>
        client("/api/admin/default-categories", {
            method: "POST",
            body: JSON.stringify({
                kind: "income",
                name: "Gehalt",
                color: "#3f8f6b",
                iconName: "banknote",
                ...body,
            }),
        });

    it("creates a default category of either kind", async () => {
        const response = await create({});
        expect(response.status).toBe(201);
        const created = await json<DefaultCategory>(response);
        expect(created).toEqual({
            id: expect.any(String) as unknown,
            kind: "income",
            name: "Gehalt",
            color: "#3f8f6b",
            iconName: "banknote",
        });
        expect(await list()).toContainEqual(created);
    });

    it("rejects a name the kind already has, but not one the other kind has", async () => {
        expect((await create({ kind: "expense", name: "Snacks" })).status).toBe(
            409,
        );
        expect((await create({ kind: "income", name: "Snacks" })).status).toBe(
            201,
        );
    });

    const categoriesOf = (client: Client) =>
        json<Category[]>(client("/api/categories"));

    it("gives new users a copy, leaving existing users' categories alone", async () => {
        const alice = (await app.signUp("alice")).client;
        const before = await categoriesOf(alice);
        await create({ kind: "income", name: "Gehalt" });

        expect(await categoriesOf(alice)).toEqual(before);
        const bob = (await app.signUp("bob")).client;
        expect(await categoriesOf(bob)).toContainEqual(
            expect.objectContaining({
                kind: "income",
                fallback: false,
                name: "Gehalt",
                color: "#3f8f6b",
                iconName: "banknote",
            }),
        );
    });

    const update = (id: string, patch: Record<string, unknown>) =>
        admin(`/api/admin/default-categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(patch),
        });

    it("renames, recolors and re-icons a default category", async () => {
        const response = await update("2", {
            name: "Lebensmittel",
            color: "#123456",
            iconName: "apple",
        });
        expect(response.status).toBe(200);
        const expected = {
            id: "2",
            kind: "expense",
            name: "Lebensmittel",
            color: "#123456",
            iconName: "apple",
        };
        expect(await json<DefaultCategory>(response)).toEqual(expected);
        expect(await list()).toContainEqual(expected);
    });

    it("keeps names unique per kind when renaming", async () => {
        expect((await update("2", { name: "Snacks" })).status).toBe(409);
        // Its own name is no conflict.
        expect((await update("2", { name: "Einkäufe" })).status).toBe(200);
    });

    it("doesn't change existing users' copies", async () => {
        const alice = (await app.signUp("alice")).client;
        const before = await categoriesOf(alice);
        await update("2", { name: "Lebensmittel", color: "#123456" });
        expect(await categoriesOf(alice)).toEqual(before);
    });

    it("answers 404 for an unknown default category", async () => {
        expect((await update("nope", { name: "X" })).status).toBe(404);
    });

    const remove = (id: string, client = admin) =>
        client(`/api/admin/default-categories/${id}`, { method: "DELETE" });

    it("deletes a default category; only new users go without it", async () => {
        const alice = (await app.signUp("alice")).client;
        const before = await categoriesOf(alice);

        expect((await remove("2")).status).toBe(204);
        expect((await list()).map((d) => d.id)).not.toContain("2");
        expect(await categoriesOf(alice)).toEqual(before);
        const bob = (await app.signUp("bob")).client;
        expect((await categoriesOf(bob)).map((c) => c.id)).not.toContain("2");
    });

    it("answers 404 when deleting an unknown default category", async () => {
        expect((await remove("nope")).status).toBe(404);
    });

    it("is admin-only", async () => {
        const alice = (await app.signUp("alice")).client;
        const requests: [string, RequestInit][] = [
            ["", { method: "GET" }],
            ["", { method: "POST", body: JSON.stringify({}) }],
            ["/2", { method: "PATCH", body: JSON.stringify({ name: "X" }) }],
            ["/2", { method: "DELETE" }],
        ];
        for (const [path, init] of requests) {
            const url = `/api/admin/default-categories${path}`;
            expect((await alice(url, init)).status).toBe(403);
            expect((await app.request(url, init)).status).toBe(401);
        }
        expect(await list()).toHaveLength(10);
    });
});
