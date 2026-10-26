import { beforeEach, describe, expect, it } from "vitest";
import type {
    FixedCostSuggestion,
    FixedCostSuggestionQuery,
} from "@finances/shared";
import {
    type Client,
    createTestApp,
    json,
    transactionBody,
} from "./test-app.ts";

const TIME_ZONE = "Europe/Berlin";

describe("fixed cost suggestion", () => {
    let alice: Client;
    let bob: Client;
    let id = 0;

    beforeEach(async () => {
        const app = await createTestApp();
        alice = (await app.signUp("alice")).client;
        bob = (await app.signUp("bob")).client;
    });

    async function add(
        client: Client,
        day: string,
        transactionId = `t${++id}`,
    ) {
        const response = await client(`/api/transactions/${transactionId}`, {
            method: "PUT",
            body: transactionBody({
                date: Date.parse(`${day}T12:00:00Z`),
                counterparty: "Netflix",
                amount: 12.99,
            }),
        });
        expect(response.ok).toBe(true);
    }

    function suggestion(
        client: Client,
        day: string,
        transactionId = `t${++id}`,
    ) {
        const query: FixedCostSuggestionQuery = {
            id: transactionId,
            counterparty: "Netflix",
            amount: 12.99,
            date: Date.parse(`${day}T12:00:00Z`),
            timeZone: TIME_ZONE,
        };
        return client(
            `/api/insights/fixed-cost-suggestion?${new URLSearchParams(
                Object.entries(query).map(([key, value]) => [
                    key,
                    String(value),
                ]),
            ).toString()}`,
        );
    }

    it("suggests a fixed cost for the user's recurring expense", async () => {
        await add(alice, "2026-08-15");
        await add(alice, "2026-09-15");

        expect(
            await json<FixedCostSuggestion | null>(
                suggestion(alice, "2026-10-15"),
            ),
        ).toEqual({
            counterparty: "Netflix",
            amount: 12.99,
            interval: "monthly",
            startDate: "2026-11-15",
        });
        expect(
            await json<FixedCostSuggestion | null>(
                suggestion(bob, "2026-10-15"),
            ),
        ).toBe(null);
    });

    it("works whether or not the new expense is already stored", async () => {
        await add(alice, "2026-08-15");
        await add(alice, "2026-09-15");
        await add(alice, "2026-10-15", "new");

        expect(
            await json<FixedCostSuggestion | null>(
                suggestion(alice, "2026-10-15", "new"),
            ),
        ).not.toBe(null);
    });

    it("stays silent once an active fixed cost has the name", async () => {
        await add(alice, "2026-08-15");
        await add(alice, "2026-09-15");
        const response = await alice("/api/fixed-costs", {
            method: "POST",
            body: JSON.stringify({
                name: "netflix",
                description: null,
                initialAmount: 12.99,
                currency: "EUR",
                interval: "monthly",
                categoryId: "1",
                active: true,
                startDate: "2026-11-15",
                endDate: null,
            }),
        });
        expect(response.ok).toBe(true);

        expect(
            await json<FixedCostSuggestion | null>(
                suggestion(alice, "2026-10-15"),
            ),
        ).toBe(null);
    });

    it("rejects an invalid query", async () => {
        const response = await alice(
            "/api/insights/fixed-cost-suggestion?id=x&counterparty=Netflix",
        );

        expect(response.status).toBe(400);
    });
});
