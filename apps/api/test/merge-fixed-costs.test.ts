import { beforeEach, describe, expect, it } from "vitest";
import type { FixedCost } from "@finances/shared";
import _ from "lodash";
import { sql } from "kysely";
import type { CommandContext } from "#/cli/command.ts";
import { mergeFixedCosts } from "#/cli/commands/merge-fixed-costs.ts";
import { type Client, createTestApp, json } from "./test-app.ts";

describe("merge-fixed-costs", () => {
    let app: Awaited<ReturnType<typeof createTestApp>>;
    let alice: Client;
    let context: CommandContext;
    let info: string[];

    beforeEach(async () => {
        app = await createTestApp();
        alice = (await app.signUp("alice")).client;
        info = [];
        context = {
            db: app.db,
            databasePath: ":memory:",
            baseURL: "https://finances.example.com",
            out: {
                info: (line) => info.push(line),
                error: (line) => info.push(line),
            },
        };
    });

    async function create(overrides: Partial<FixedCost> = {}) {
        const response = await alice("/api/fixed-costs", {
            method: "POST",
            body: JSON.stringify({
                name: "Internet",
                description: null,
                initialAmount: 63,
                currency: "EUR",
                interval: "monthly",
                categoryId: "1",
                active: true,
                startDate: "2025-12-31",
                endDate: null,
                ...overrides,
            }),
        });
        expect(response.status).toBe(201);
        return json<FixedCost>(response);
    }

    function list() {
        return json<FixedCost[]>(alice("/api/fixed-costs"));
    }

    /**
     * The real case: three fixed costs, each starting the day after the
     * previous one ends.
     */
    async function createInternetChain() {
        const first = await create({
            startDate: "2025-12-31",
            endDate: "2026-05-30",
            initialAmount: 63,
            description: "Old contract",
        });
        await create({
            startDate: "2026-05-31",
            endDate: "2026-12-31",
            initialAmount: 59.85,
        });
        await create({
            name: " internet ",
            startDate: "2027-01-01",
            endDate: null,
            initialAmount: 63.46,
            description: "New contract",
        });
        return first;
    }

    it("merges a next-day chain into its first fixed cost", async () => {
        const first = await createInternetChain();

        expect(await mergeFixedCosts(context, { apply: true })).toBe(0);

        expect(await list()).toEqual([
            {
                ...first,
                name: "internet",
                description: "New contract",
                initialAmount: 63,
                priceChanges: [
                    { date: "2026-05-31", amount: 59.85 },
                    { date: "2027-01-01", amount: 63.46 },
                ],
                startDate: "2025-12-31",
                endDate: null,
            },
        ]);
    });
    it("prints the chain in a dry run and changes nothing", async () => {
        const first = await createInternetChain();
        const before = await list();
        const [, second, third] = _.sortBy(before, "startDate");

        expect(await mergeFixedCosts(context, { apply: false })).toBe(0);

        expect(info).toEqual([
            "alice: internet",
            `  ${first.id}  2025-12-31 to 2026-05-30  63 EUR`,
            `  ${second?.id}  2026-05-31 to 2026-12-31  59.85 EUR  next day`,
            `  ${third?.id}  2027-01-01 to open end  63.46 EUR  next day`,
            `  merged into ${first.id}: 2025-12-31 to open end  63 EUR`,
            "    from 2026-05-31: 59.85 EUR",
            "    from 2027-01-01: 63.46 EUR",
            `  drops the description of ${first.id}: "Old contract"`,
            "Dry run: 1 chain(s) to merge. Run `finances merge-fixed-costs --apply` to merge them.",
        ]);
        expect(await list()).toEqual(before);
    });

    it("finds nothing after the merge", async () => {
        await createInternetChain();
        await mergeFixedCosts(context, { apply: true });
        info = [];

        expect(await mergeFixedCosts(context, { apply: false })).toBe(0);

        expect(info).toEqual(["No fixed costs to merge."]);
    });

    it("doesn't chain the same name in different categories", async () => {
        await create({ endDate: "2026-05-30", categoryId: "1" });
        await create({ startDate: "2026-05-31", categoryId: "2" });
        const before = await list();

        await mergeFixedCosts(context, { apply: true });

        expect(info).toEqual(["No fixed costs to merge."]);
        expect(await list()).toEqual(before);
    });

    it.each([
        ["a gap", "2026-06-07", "gap of 7 day(s)"],
        ["an overlap", "2026-05-24", "overlap of 7 day(s)"],
    ])(
        "chains with %s of up to 7 days",
        async (_label, startDate, description) => {
            const first = await create({ endDate: "2026-05-30" });
            await create({ startDate, initialAmount: 70 });

            await mergeFixedCosts(context, { apply: true });

            expect(info[2]?.endsWith(`  ${description}`)).toBe(true);
            expect(await list()).toEqual([
                {
                    ...first,
                    priceChanges: [{ date: startDate, amount: 70 }],
                    endDate: null,
                },
            ]);
        },
    );

    it.each([
        ["a gap", "2026-06-08"],
        ["an overlap", "2026-05-23"],
    ])("doesn't chain with %s of 8 days", async (_label, startDate) => {
        await create({ endDate: "2026-05-30" });
        await create({ startDate });

        await mergeFixedCosts(context, { apply: true });

        expect(info).toEqual(["No fixed costs to merge."]);
        expect(await list()).toHaveLength(2);
    });

    it("skips a chain with a fork as ambiguous", async () => {
        const first = await create({ endDate: "2026-05-30" });
        const second = await create({
            startDate: "2026-05-31",
            endDate: "2026-12-31",
        });
        const fork = await create({ startDate: "2026-06-01" });
        const third = await create({ startDate: "2027-01-01" });
        const before = await list();

        await mergeFixedCosts(context, { apply: true });

        expect(info).toEqual([
            "Skipped as ambiguous (a fixed cost has several candidates):",
            `  alice: ${[first, second, fork, third].map((it) => `Internet (${it.id})`).join(", ")}`,
            "No fixed costs to merge.",
        ]);
        expect(await list()).toEqual(before);
    });

    it("applies all chains or none", async () => {
        await create({ endDate: "2026-05-30" });
        await create({ startDate: "2026-05-31" });
        await create({ name: "Rent", endDate: "2026-05-30" });
        const rent = await create({ name: "Rent", startDate: "2026-05-31" });
        const before = await list();
        // Fails the second chain's write, after the first chain's.
        await sql`
            create trigger fail_rent before delete on fixed_costs
            when old.id = ${sql.lit(rent.id)}
            begin select raise(abort, 'boom'); end`.execute(app.db);

        await expect(mergeFixedCosts(context, { apply: true })).rejects.toThrow(
            "boom",
        );

        expect(await list()).toEqual(before);
    });
});
