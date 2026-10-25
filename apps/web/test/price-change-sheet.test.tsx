import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { FixedCost, PriceChange } from "@finances/shared";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "#/api/query-client.ts";
import { PriceChangeSheet } from "#/features/fixed-costs/detail/price-change-sheet.tsx";

const record: FixedCost = {
    id: "f1",
    name: "Netflix",
    description: null,
    initialAmount: 10,
    priceChanges: [{ date: "2026-03-01", amount: 12 }],
    currency: "EUR",
    interval: "monthly",
    categoryId: "1",
    active: true,
    startDate: "2026-01-01",
    endDate: null,
};

/**
 * Answers every request with `status` and `body`; returns the fetch mock.
 */
function fakeServer(status = 200, body: unknown = record) {
    const fetch = vi.fn(() =>
        Promise.resolve(new Response(JSON.stringify(body), { status })),
    );
    vi.stubGlobal("fetch", fetch);
    return fetch;
}

/**
 * The `priceChanges` of the only PATCH sent.
 */
function sentPriceChanges(fetch: ReturnType<typeof fakeServer>) {
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/fixed-costs/f1");
    expect(init.method).toBe("PATCH");
    return (JSON.parse(init.body as string) as { priceChanges: unknown })
        .priceChanges;
}

function renderSheet(change: PriceChange | null, today = "2026-06-01") {
    render(
        <QueryClientProvider client={createQueryClient(() => undefined)}>
            <PriceChangeSheet
                record={record}
                change={change}
                today={today}
                open
                onOpenChange={() => undefined}
            />
        </QueryClientProvider>,
    );
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("PriceChangeSheet", () => {
    it("adds a price change today with today's amount", async () => {
        const fetch = fakeServer();
        renderSheet(null);

        fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

        await waitFor(() =>
            expect(sentPriceChanges(fetch)).toEqual([
                { date: "2026-03-01", amount: 12 },
                { date: "2026-06-01", amount: 12 },
            ]),
        );
    });

    it("saves an edited price change with its new amount", async () => {
        const fetch = fakeServer();
        renderSheet({ date: "2026-03-01", amount: 12 });

        const amount = screen.getByLabelText("Neuer Betrag (EUR)");
        fireEvent.change(amount, { target: { value: "15" } });
        fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

        await waitFor(() =>
            expect(sentPriceChanges(fetch)).toEqual([
                { date: "2026-03-01", amount: 15 },
            ]),
        );
    });

    it("deletes the edited price change", async () => {
        const fetch = fakeServer();
        renderSheet({ date: "2026-03-01", amount: 12 });

        fireEvent.click(screen.getByRole("button", { name: "Löschen" }));

        await waitFor(() => expect(sentPriceChanges(fetch)).toEqual([]));
    });

    it("rejects a date on the start date without asking the server", () => {
        const fetch = fakeServer();
        renderSheet(null, "2026-01-01");

        fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Eine Preisänderung muss nach dem Startdatum liegen.",
        );
        expect(fetch).not.toHaveBeenCalled();
    });

    it("shows the server's out-of-range error inline", async () => {
        fakeServer(422, { error: "price_change_out_of_range" });
        renderSheet(null);

        fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Eine Preisänderung liegt außerhalb von Start- und Enddatum.",
        );
    });
});
