import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "kysely";
import type { FixedCost, Transaction } from "@finances/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DB } from "#/db/database.ts";
import {
    createTestApp,
    fixedCostBody,
    json,
    transactionBody,
} from "./test-app.ts";

/**
 * Back to the schema before the amount history: each fixed cost gets its
 * first amount and is active.
 */
async function undoFixedCostAmounts(db: DB) {
    await sql`alter table fixed_costs add column amount NUMERIC not null default 0`.execute(
        db,
    );
    await sql`alter table fixed_costs add column interval TEXT not null default 'monthly'`.execute(
        db,
    );
    await sql`alter table fixed_costs add column active INTEGER not null default 1`.execute(
        db,
    );
    for (const column of ["amount", "interval"]) {
        await sql`
            update fixed_costs
            set ${sql.ref(column)} = (select ${sql.ref(`a.${column}`)}
                                      from fixed_cost_amounts a
                                      where a.user_id = fixed_costs.user_id
                                        and a.fixed_cost_id = fixed_costs.id
                                      order by a.valid_from
                                      limit 1)`.execute(db);
    }
    await sql`drop table fixed_cost_amounts`.execute(db);
    await sql`delete from kysely_migration where name = '0004-fixed-cost-amounts'`.execute(
        db,
    );
}

describe("migrations", () => {
    let dir: string;

    beforeEach(async () => {
        dir = await mkdtemp(join(tmpdir(), "finances-test-"));
    });

    afterEach(async () => {
        vi.useRealTimers();
        await rm(dir, { recursive: true, force: true });
    });

    it("gives fixed costs their amount as history and ends inactive ones today", async () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date("2026-10-18T12:00:00Z"));
        const filename = join(dir, "finances.db");
        const before = await createTestApp({ filename });
        const { client } = await before.signUp("alice");
        const amounts = [
            { validFrom: "2026-01-01", amount: 30, interval: "quarterly" },
        ];
        for (const [name, endDate] of [
            ["Running", null],
            ["Paused", null],
            ["Paused later", "2026-12-31"],
            ["Paused before", "2026-02-28"],
        ]) {
            await client("/api/fixed-costs", {
                method: "POST",
                body: fixedCostBody({ name, endDate, amounts }),
            });
        }
        await undoFixedCostAmounts(before.db);
        await sql`update fixed_costs set active = 0 where name like 'Paused%'`.execute(
            before.db,
        );
        await before.db.destroy();

        const after = await createTestApp({ filename });
        const alice = await after.login("alice");
        const fixedCosts = await json<FixedCost[]>(alice("/api/fixed-costs"));
        expect(fixedCosts.map((it) => [it.name, it.endDate])).toEqual([
            ["Paused", "2026-10-18"],
            ["Paused before", "2026-02-28"],
            ["Paused later", "2026-10-18"],
            ["Running", null],
        ]);
        expect(fixedCosts.map((it) => it.amounts)).toEqual(
            fixedCosts.map(() => amounts),
        );
        await after.db.destroy();
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
        await undoFixedCostAmounts(before.db);
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
