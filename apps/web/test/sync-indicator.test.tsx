import { act, fireEvent, render, screen } from "@testing-library/react";
import {
    MutationObserver,
    onlineManager,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Transaction } from "@finances/shared";
import { createQueryClient } from "#/api/query-client.ts";
import { SyncIndicator } from "#/features/sync/sync-indicator.tsx";
import { syncFailures } from "#/features/sync/sync-failures.ts";
import { registerTransactionMutations } from "#/features/transactions/transaction-mutations.ts";

/**
 * Answers transaction requests with the given statuses in order, then with
 * 204. The health check always answers.
 */
function fakeServer() {
    const statuses: number[] = [];

    vi.stubGlobal(
        "fetch",
        vi.fn((url: string) => {
            const status =
                url === "/api/health" ? 200 : (statuses.shift() ?? 204);
            return Promise.resolve(
                status < 300
                    ? new Response(null, { status })
                    : new Response(JSON.stringify({ error: "invalid_input" }), {
                          status,
                      }),
            );
        }),
    );

    return {
        answer: (...next: number[]) => statuses.push(...next),
    };
}

let nextId = 0;

function transaction(): Transaction {
    nextId += 1;
    return {
        id: `t${nextId}`,
        kind: "expense",
        amount: 12.5,
        currency: "EUR",
        counterparty: "Bäcker",
        description: null,
        date: new Date(2026, 9, 25).getTime(),
        categoryId: "food",
        exceptional: false,
        location: null,
    };
}

function renderIndicator() {
    const queryClient = createQueryClient(() => undefined);
    registerTransactionMutations(queryClient, {
        onUnauthorized: () => undefined,
    });
    render(
        <QueryClientProvider client={queryClient}>
            <SyncIndicator />
            <Toaster />
        </QueryClientProvider>,
    );

    return {
        /**
         * Queues a save like the transaction form does.
         */
        save: async () => {
            await act(async () => {
                void new MutationObserver<unknown, Error, Transaction>(
                    queryClient,
                    { mutationKey: ["transactions", "save"] },
                )
                    .mutate(transaction())
                    .catch(() => undefined);
                await Promise.resolve();
            });
        },
    };
}

async function setOnline(isOnline: boolean) {
    await act(async () => {
        onlineManager.setOnline(isOnline);
        await Promise.resolve();
    });
}

function wait(ms: number) {
    return act(() => vi.advanceTimersByTimeAsync(ms));
}

/**
 * Saves one change offline and reconnects, so it's sent.
 */
async function syncOffline(save: () => Promise<void>) {
    await setOnline(false);
    await save();
    await setOnline(true);
    await wait(100);
}

function rejectionToasts() {
    return screen.queryAllByText(/abgelehnt/, { selector: "[data-title]" });
}

function strip() {
    return screen.queryByTestId("sync-indicator");
}

function announcement() {
    return screen.getByRole("status").textContent;
}

let server: ReturnType<typeof fakeServer>;

beforeEach(() => {
    vi.useFakeTimers();
    onlineManager.setOnline(true);
    syncFailures.clear();
    server = fakeServer();
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("SyncIndicator", () => {
    it("shows nothing for a save while online", async () => {
        const { save } = renderIndicator();

        await save();
        await wait(100);

        expect(strip()).not.toBeInTheDocument();
        expect(announcement()).toBe("");
    });

    it("shows a green strip once changes made offline are synced", async () => {
        const { save } = renderIndicator();

        await setOnline(false);
        await save();
        await save();
        await wait(100);
        expect(strip()).not.toBeInTheDocument();

        await setOnline(true);
        await wait(100);

        expect(strip()).toHaveAttribute("data-state", "synced");
        expect(announcement()).toBe("2 Änderungen synchronisiert");

        await wait(2800);
        expect(strip()).toBeInTheDocument();
        await wait(200);
        expect(strip()).not.toBeInTheDocument();
    });

    it("shows a green strip once a save the server failed is retried successfully", async () => {
        const { save } = renderIndicator();
        server.answer(503);

        await save();
        await wait(100);
        expect(strip()).not.toBeInTheDocument();

        await wait(2000);

        expect(strip()).toHaveAttribute("data-state", "synced");
        expect(announcement()).toBe("1 Änderung synchronisiert");
    });

    it("shows nothing when reconnecting without pending changes", async () => {
        renderIndicator();

        await setOnline(false);
        await wait(100);
        await setOnline(true);
        await wait(100);

        expect(strip()).not.toBeInTheDocument();
    });

    it("shows a red strip and a toast when the server rejects changes", async () => {
        const { save } = renderIndicator();
        server.answer(422, 204, 422);

        await setOnline(false);
        await save();
        await save();
        await save();
        await setOnline(true);
        await wait(100);

        expect(strip()).toHaveAttribute("data-state", "rejected");
        expect(announcement()).toBe("2 Änderungen abgelehnt");
        expect(
            screen.getByText("2 Änderungen abgelehnt", {
                selector: "[data-title]",
            }),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Details" }));
        expect(
            screen.getByRole("dialog", { name: "Synchronisierung" }),
        ).toBeInTheDocument();

        await wait(5800);
        expect(strip()).toBeInTheDocument();
        await wait(200);
        expect(strip()).not.toBeInTheDocument();
    });

    it("keeps the green strip's timing when another sync succeeds meanwhile", async () => {
        const { save } = renderIndicator();
        await syncOffline(save);

        await wait(1500);
        await syncOffline(save);

        expect(announcement()).toBe("1 Änderung synchronisiert");
        await wait(1200);
        expect(strip()).toBeInTheDocument();
        await wait(200);
        expect(strip()).not.toBeInTheDocument();
    });

    it("turns the green strip red when a later sync is rejected", async () => {
        const { save } = renderIndicator();
        await syncOffline(save);

        await wait(1500);
        server.answer(422);
        await syncOffline(save);

        expect(strip()).toHaveAttribute("data-state", "rejected");
        expect(announcement()).toBe("1 Änderung abgelehnt");
        await wait(5800);
        expect(strip()).toBeInTheDocument();
        await wait(200);
        expect(strip()).not.toBeInTheDocument();
    });

    it("keeps the red strip when a later sync succeeds", async () => {
        const { save } = renderIndicator();
        server.answer(422);
        await syncOffline(save);

        await wait(1000);
        await syncOffline(save);

        expect(strip()).toHaveAttribute("data-state", "rejected");
        expect(announcement()).toBe("1 Änderung abgelehnt");
    });

    it("updates the toast for a further rejection instead of adding one", async () => {
        const { save } = renderIndicator();
        server.answer(422);
        await syncOffline(save);

        await wait(1000);
        server.answer(422);
        await syncOffline(save);

        expect(rejectionToasts()).toHaveLength(1);
        expect(rejectionToasts()[0]).toHaveTextContent(
            "2 Änderungen abgelehnt",
        );
    });

    it("speaks English with singular and plural forms", async () => {
        localStorage.setItem("finances-locale", "en");
        const { save } = renderIndicator();

        await syncOffline(save);
        expect(announcement()).toBe("1 change synced");

        await wait(1000);
        server.answer(422, 422);
        await setOnline(false);
        await save();
        await save();
        await setOnline(true);
        await wait(100);

        expect(announcement()).toBe("2 changes rejected");
        expect(
            screen.getByRole("button", { name: "Details" }),
        ).toBeInTheDocument();
    });

    it("shows the next sync normally once the strip has faded", async () => {
        const { save } = renderIndicator();
        await syncOffline(save);
        await wait(3000);
        expect(strip()).not.toBeInTheDocument();

        await syncOffline(save);

        expect(strip()).toHaveAttribute("data-state", "synced");
        expect(announcement()).toBe("1 Änderung synchronisiert");
    });
});
