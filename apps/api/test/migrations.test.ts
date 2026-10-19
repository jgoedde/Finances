import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "kysely";
import type { Transaction } from "@finances/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestApp, json, transactionBody } from "./test-app.ts";

describe("migrations", () => {
    let dir: string;

    beforeEach(async () => {
        dir = await mkdtemp(join(tmpdir(), "finances-test-"));
    });

    afterEach(async () => {
        await rm(dir, { recursive: true, force: true });
    });

    it("keeps transaction names as their counterparty", async () => {
        const filename = join(dir, "finances.db");
        const before = await createTestApp({ filename });
        const { client } = await before.signUp("alice");
        await client("/api/transactions/t1", {
            method: "PUT",
            body: transactionBody({ counterparty: "Bäcker" }),
        });
        // Back to the schema before the rename.
        for (const column of [
            "location_lat",
            "location_lng",
            "location_accuracy",
        ]) {
            await sql`alter table transactions drop column ${sql.ref(column)}`.execute(
                before.db,
            );
        }
        await sql`delete from kysely_migration where name = '0003-transaction-location'`.execute(
            before.db,
        );
        await sql`alter table transactions rename column counterparty to name`.execute(
            before.db,
        );
        await sql`delete from kysely_migration where name = '0002-transaction-counterparty'`.execute(
            before.db,
        );
        await before.db.destroy();

        const after = await createTestApp({ filename });
        const alice = await after.login("alice");
        const transaction = await json<Transaction>(
            alice("/api/transactions/t1"),
        );
        expect(transaction.counterparty).toBe("Bäcker");
        await after.db.destroy();
    });
});
