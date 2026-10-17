import { beforeEach, describe, expect, it } from "vitest";
import type { Transaction } from "@finances/shared";
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
            body: transactionBody({ name: "Alice" }),
        });

        expect((await bob("/api/transactions/same-id")).status).toBe(404);
        expect(await list(bob)).toEqual([]);

        await bob("/api/transactions/same-id", {
            method: "PUT",
            body: transactionBody({ name: "Bob" }),
        });
        await bob("/api/transactions/same-id", { method: "DELETE" });

        const own = await json<Transaction>(alice("/api/transactions/same-id"));
        expect(own.name).toBe("Alice");
    });

    it("treats a replayed PUT as one transaction, last write wins", async () => {
        const put = (name: string) =>
            alice("/api/transactions/t1", {
                method: "PUT",
                body: transactionBody({ name }),
            });

        expect((await put("first")).status).toBe(200);
        expect((await put("first")).status).toBe(200);
        await put("second");

        const rows = await list(alice);
        expect(rows).toHaveLength(1);
        expect(rows[0]?.name).toBe("second");
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
            body: transactionBody({ name: "late edit" }),
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

    it("reports net spending and income separately", async () => {
        await alice("/api/transactions/e1", {
            method: "PUT",
            body: transactionBody({ amount: 30 }),
        });
        await alice("/api/transactions/i1", {
            method: "PUT",
            body: transactionBody({ kind: "income", amount: 100 }),
        });
        const spent = (kind?: string) =>
            json(
                alice(
                    `/api/insights/spent?from=0&to=${Date.now() + 1000}${kind ? `&kind=${kind}` : ""}`,
                ),
            );

        expect(await spent()).toEqual({ total: -70 });
        expect(await spent("expense")).toEqual({ total: 30 });
        expect(await spent("income")).toEqual({ total: 100 });
    });
});
