import SQLite from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import type {
    DataExport,
    FixedCost,
    ImportResult,
    Transaction,
} from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

/**
 * A database file as the old browser-only app wrote it.
 */
function legacyDatabase({ walHeader = false } = {}): Buffer {
    const db = new SQLite(":memory:");
    db.exec(`
        create table categories (id INTEGER primary key autoincrement, name TEXT not null unique, color TEXT not null unique, icon_name TEXT not null unique);
        create table expenses (id TEXT not null primary key, date INTEGER not null, name TEXT not null, description TEXT default null, amount NUMERIC not null, currency TEXT not null, category_id INTEGER not null references categories, exceptional INTEGER default 0);
        create table fixed_cost_categories (id integer primary key autoincrement, name text not null unique, description text default null);
        create table fixed_costs (id INTEGER primary key autoincrement, name TEXT not null, description TEXT default NULL, amount NUMERIC not null, currency TEXT default 'EUR' not null, interval TEXT default 'monthly' not null, category_id INTEGER not null references fixed_cost_categories, active INTEGER default 1 not null, start_date TEXT not null, end_date TEXT default NULL);
        insert into categories values (1, 'Auswärts essen', '#00202e', 'utensils'), (11, 'Haustier', '#123456', 'dog');
        insert into expenses values
            ('abc12345', 1760000000000, 'Pizza', null, 12.5, 'EUR', 1, 0),
            ('def67890', 1760000100000, 'Gehalt', 'Oktober', -2000, 'EUR', 11, 1);
        insert into fixed_cost_categories values (1, 'Miete / Wohnung', 'inkl. Nebenkosten');
        insert into fixed_costs values (1, 'Miete', null, 900, 'EUR', 'monthly', 1, 1, '2026-01-01T09:30:00.000Z', null);
    `);
    const bytes = db.serialize();
    db.close();
    if (walHeader) {
        // As left behind by a desktop tool that opened the file in WAL mode.
        bytes[18] = 2;
        bytes[19] = 2;
    }
    return bytes;
}

describe("data transfer", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let alice: Client;

    beforeEach(async () => {
        app = await createTestApp();
        alice = (await app.signUp("alice")).client;
    });

    function upload(
        client: Client,
        body: RequestInit["body"],
        { replace = false } = {},
    ) {
        return client(`/api/data/import${replace ? "?replace=true" : ""}`, {
            method: "POST",
            body,
            headers: { "content-type": "application/octet-stream" },
        });
    }

    async function list<T>(client: Client, path: string) {
        return json<T[]>(client(path));
    }

    it("imports a legacy database", async () => {
        const response = await upload(alice, legacyDatabase());
        expect(response.status).toBe(200);
        expect(await json<ImportResult>(response)).toEqual({
            categories: 2,
            fixedCosts: 1,
            transactions: 2,
        });

        const transactions = await list<Transaction>(
            alice,
            `/api/transactions?from=0&to=${Date.now()}`,
        );
        expect(transactions).toEqual([
            expect.objectContaining({
                id: "def67890",
                kind: "income",
                amount: 2000,
                categoryId: "11",
                exceptional: true,
            }),
            expect.objectContaining({
                id: "abc12345",
                counterparty: "Pizza",
                kind: "expense",
                amount: 12.5,
                categoryId: "1",
            }),
        ]);
        // The seeded categories are replaced by the imported ones.
        expect(await list(alice, "/api/categories")).toHaveLength(2);
        expect(await list<FixedCost>(alice, "/api/fixed-costs")).toEqual([
            expect.objectContaining({ name: "Miete", startDate: "2026-01-01" }),
        ]);
    });

    it("imports a legacy database whose header says WAL mode", async () => {
        const response = await upload(
            alice,
            legacyDatabase({ walHeader: true }),
        );
        expect(response.status).toBe(200);
    });

    it("round-trips an export into another account", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ categoryId: "3" }),
        });
        const exported = await json<DataExport>(alice("/api/data/export"));

        const bob = (await app.signUp("bob")).client;
        expect((await upload(bob, JSON.stringify(exported))).status).toBe(200);

        const reexported = await json<DataExport>(bob("/api/data/export"));
        expect({ ...reexported, exportedAt: "" }).toEqual({
            ...exported,
            exportedAt: "",
        });
    });

    it("imports a version 1 export, whose transactions have a name", async () => {
        const exported = await json<DataExport>(alice("/api/data/export"));
        const { counterparty, ...rest } = JSON.parse(
            transactionBody({ counterparty: "Bäcker" }),
        ) as Transaction;
        const v1 = {
            ...exported,
            version: 1,
            transactions: [{ ...rest, id: "t1", name: counterparty }],
        };
        expect((await upload(alice, JSON.stringify(v1))).status).toBe(200);

        const reexported = await json<DataExport>(alice("/api/data/export"));
        expect(reexported.version).toBe(2);
        expect(reexported.transactions).toEqual([
            { ...rest, id: "t1", counterparty: "Bäcker" },
        ]);
    });

    it("only imports into an account without data", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody(),
        });
        expect((await upload(alice, legacyDatabase())).status).toBe(409);
    });

    it("replaces all data when asked to", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody(),
        });
        await upload(alice, legacyDatabase(), { replace: true });
        // Again: the same ids were just replaced, which must not block them.
        const again = await upload(alice, legacyDatabase(), { replace: true });
        expect(again.status).toBe(200);

        const transactions = await list<Transaction>(
            alice,
            `/api/transactions?from=0&to=${Date.now()}`,
        );
        expect(transactions.map((t) => t.id).sort()).toEqual([
            "abc12345",
            "def67890",
        ]);
        expect(await list(alice, "/api/categories")).toHaveLength(2);
        expect(await list(alice, "/api/fixed-costs")).toHaveLength(1);
    });

    it("keeps the data when a replacing import is invalid", async () => {
        await alice("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody(),
        });
        const response = await upload(alice, "not a backup", {
            replace: true,
        });
        expect(response.status).toBe(422);
        expect(
            await list(
                alice,
                `/api/transactions?from=0&to=${Date.now() + 1000}`,
            ),
        ).toHaveLength(1);
    });

    it("rejects unreadable and invalid files without changing anything", async () => {
        expect((await upload(alice, "not a backup")).status).toBe(422);
        expect(
            (await upload(alice, JSON.stringify({ format: "other" }))).status,
        ).toBe(422);

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
        expect((await upload(alice, JSON.stringify(broken))).status).toBe(422);
        expect(await list(alice, "/api/categories")).toHaveLength(10);
    });

    it("leaves other users alone", async () => {
        const bob = (await app.signUp("bob")).client;
        await upload(alice, legacyDatabase());
        expect(await list(bob, "/api/categories")).toHaveLength(10);
        expect(
            await list(bob, `/api/transactions?from=0&to=${Date.now()}`),
        ).toEqual([]);
    });
});
