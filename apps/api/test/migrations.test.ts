import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "kysely";
import {
    type Category,
    FALLBACK_CATEGORIES,
    type FixedCost,
    type FixedCostCategory,
    type Transaction,
} from "@finances/shared";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DB } from "#/db/database.ts";
import { createTestApp, json, transactionBody } from "./test-app.ts";

/**
 * Back to the schema before `0006-category-kinds`: no fallback categories,
 * and incomes in expense categories (`incomeCategoryId`).
 */
async function undoCategoryKinds(db: DB, incomeCategoryId = "1") {
    await sql`pragma foreign_keys = off`.execute(db);
    await sql`
        update transactions
        set category_id = ${incomeCategoryId}
        where kind = 'income'`.execute(db);
    await sql`
        create table categories_old
        (
            user_id   TEXT not null references "user" (id) on delete cascade,
            id        TEXT not null,
            name      TEXT not null,
            color     TEXT not null,
            icon_name TEXT not null,
            primary key (user_id, id),
            unique (user_id, name),
            unique (user_id, color),
            unique (user_id, icon_name)
        )`.execute(db);
    await sql`
        insert into categories_old (user_id, id, name, color, icon_name)
        select user_id, id, name, color, icon_name
        from categories
        where fallback = 0`.execute(db);
    await sql`drop table categories`.execute(db);
    await sql`alter table categories_old rename to categories`.execute(db);
    await sql`pragma foreign_keys = on`.execute(db);
    await sql`delete from kysely_migration where name = '0006-category-kinds'`.execute(
        db,
    );
}

/**
 * Back to the schema before `0005-fixed-cost-category-hue`.
 */
async function undoCategoryHue(db: DB) {
    await undoCategoryKinds(db);
    await sql`alter table fixed_cost_categories drop column hue`.execute(db);
    await sql`delete from kysely_migration where name = '0005-fixed-cost-category-hue'`.execute(
        db,
    );
}

/**
 * Back to the schema before `0004-fixed-cost-price-changes`.
 */
async function undoPriceChanges(db: DB) {
    await undoCategoryHue(db);
    await sql`drop table fixed_cost_price_changes`.execute(db);
    await sql`alter table fixed_costs rename column initial_amount to amount`.execute(
        db,
    );
    await sql`delete from kysely_migration where name = '0004-fixed-cost-price-changes'`.execute(
        db,
    );
}

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
        await undoPriceChanges(before.db);
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

    it("keeps fixed cost amounts as their initial amount", async () => {
        const filename = join(dir, "finances.db");
        const before = await createTestApp({ filename });
        const { client } = await before.signUp("alice");
        const created = await json<FixedCost>(
            client("/api/fixed-costs", {
                method: "POST",
                body: JSON.stringify({
                    name: "Rent",
                    description: null,
                    initialAmount: 500,
                    currency: "EUR",
                    interval: "monthly",
                    categoryId: "1",
                    active: true,
                    startDate: "2026-01-01",
                    endDate: null,
                }),
            }),
        );
        await undoPriceChanges(before.db);
        await before.db.destroy();

        const after = await createTestApp({ filename });
        const alice = await after.login("alice");
        const fixedCost = await json<FixedCost>(
            alice(`/api/fixed-costs/${created.id}`),
        );
        expect(fixedCost).toMatchObject({
            initialAmount: 500,
            priceChanges: [],
        });
        await after.db.destroy();
    });

    it("seeds fixed cost category hues", async () => {
        const filename = join(dir, "finances.db");
        const before = await createTestApp({ filename });
        await before.signUp("alice");
        await undoCategoryHue(before.db);
        await before.db.destroy();

        const after = await createTestApp({ filename });
        const alice = await after.login("alice");
        const categories = await json<FixedCostCategory[]>(
            alice("/api/fixed-cost-categories"),
        );
        expect(categories.find((it) => it.id === "1")?.hue).toBe(30);
        expect(new Set(categories.map((it) => it.hue)).size).toBe(
            categories.length,
        );
        await after.db.destroy();
    });

    it("gives every user both fallback categories and moves incomes onto the income one", async () => {
        const filename = join(dir, "finances.db");
        const before = await createTestApp({ filename });
        const alice = (await before.signUp("alice")).client;
        await before.signUp("bob");
        await alice("/api/transactions/e1", {
            method: "PUT",
            body: transactionBody({ categoryId: "2" }),
        });
        await alice("/api/transactions/i1", {
            method: "PUT",
            body: transactionBody({
                kind: "income",
                categoryId: FALLBACK_CATEGORIES.income.id,
            }),
        });
        await undoCategoryKinds(before.db, "3");
        await before.db.destroy();

        const after = await createTestApp({ filename });
        for (const username of ["alice", "bob"]) {
            const client = await after.login(username);
            const categories = await json<Category[]>(
                client("/api/categories"),
            );
            expect(categories).toHaveLength(12);
            expect(
                categories
                    .filter((c) => !c.fallback)
                    .every((c) => c.kind === "expense"),
            ).toBe(true);
            expect(categories.filter((c) => c.fallback)).toEqual(
                Object.values(FALLBACK_CATEGORIES),
            );
        }
        const transactions = await json<Transaction[]>(
            (await after.login("alice"))(
                `/api/transactions?from=0&to=${Date.now()}`,
            ),
        );
        expect(
            Object.fromEntries(transactions.map((t) => [t.id, t.categoryId])),
        ).toEqual({ e1: "2", i1: FALLBACK_CATEGORIES.income.id });
        await after.db.destroy();
    });
});
