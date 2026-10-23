import { beforeEach, describe, expect, it } from "vitest";
import type { FixedCost } from "@finances/shared";
import { type Client, createTestApp, fixedCostBody, json } from "./test-app.ts";

describe("fixed costs", () => {
    let alice: Client;
    let bob: Client;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
        bob = (await app.signUp("bob")).client;
    });

    async function create(client: Client, body = fixedCostBody()) {
        const response = await client("/api/fixed-costs", {
            method: "POST",
            body,
        });
        expect(response.status).toBe(201);
        return json<FixedCost>(response);
    }

    function update(id: string, patch: Record<string, unknown>) {
        return alice(`/api/fixed-costs/${id}`, {
            method: "PATCH",
            body: JSON.stringify(patch),
        });
    }

    it("keeps the amount history", async () => {
        const { id, amounts } = await create(alice);

        expect(amounts).toEqual([
            { validFrom: "2026-01-01", amount: 800, interval: "monthly" },
            { validFrom: "2026-10-01", amount: 850, interval: "monthly" },
        ]);
        expect(
            (await json<FixedCost>(alice(`/api/fixed-costs/${id}`))).amounts,
        ).toEqual(amounts);
    });

    it("replaces the amount history together with the start date", async () => {
        const { id } = await create(alice);
        const amounts = [
            { validFrom: "2026-03-01", amount: 820, interval: "monthly" },
        ];

        const response = await update(id, { startDate: "2026-03-01", amounts });

        expect(response.status).toBe(200);
        expect(await json<FixedCost>(response)).toMatchObject({
            startDate: "2026-03-01",
            amounts,
        });
    });

    it("rejects an amount history that doesn't start on the start date or isn't ascending", async () => {
        const amount = (validFrom: string) => ({
            validFrom,
            amount: 1,
            interval: "monthly",
        });
        for (const amounts of [
            [amount("2026-02-01")],
            [amount("2026-01-01"), amount("2026-01-01")],
            [amount("2026-01-01"), amount("2026-03-01"), amount("2026-02-01")],
            [],
        ]) {
            const response = await alice("/api/fixed-costs", {
                method: "POST",
                body: fixedCostBody({ amounts }),
            });
            expect(response.status).toBe(400);
        }

        const { id } = await create(alice);
        expect((await update(id, { startDate: "2026-02-01" })).status).toBe(
            400,
        );
        expect(
            (await update(id, { amounts: [amount("2026-01-01")] })).status,
        ).toBe(400);
    });

    it("deletes a fixed cost with its history", async () => {
        const { id } = await create(alice);

        expect(
            (await alice(`/api/fixed-costs/${id}`, { method: "DELETE" }))
                .status,
        ).toBe(204);
        expect((await alice(`/api/fixed-costs/${id}`)).status).toBe(404);
    });

    it("only shows the user's own fixed costs", async () => {
        const { id } = await create(alice);

        expect(await json(bob("/api/fixed-costs"))).toEqual([]);
        expect((await bob(`/api/fixed-costs/${id}`)).status).toBe(404);
        expect((await update(id, { name: "Mine" })).status).toBe(200);
        expect(
            (
                await bob(`/api/fixed-costs/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ name: "Bob's" }),
                })
            ).status,
        ).toBe(404);
    });
});
