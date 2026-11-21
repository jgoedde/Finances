import { act, render, screen, within } from "@testing-library/react";
import { MutationObserver, QueryClientProvider } from "@tanstack/react-query";
import {
    createMemoryHistory,
    createRouter,
    RouterProvider,
} from "@tanstack/react-router";
import { endOfMonth } from "date-fns";
import type {
    Category,
    Transaction,
    TransactionSearchPage,
} from "@finances/shared";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "#/api/query-client.ts";
import { sessionQuery } from "#/auth/auth-client.ts";
import { registerTransactionMutations } from "#/features/transactions/transaction-mutations.ts";
import { routeTree } from "#/routeTree.gen.ts";

const october = new Date(2026, 9, 1);
const day = new Date(2026, 9, 14, 19).getTime();

const categories: Category[] = [
    {
        id: "restaurant",
        name: "Restaurant",
        color: "#e57373",
        iconName: "utensils",
        kind: "expense",
        fallback: false,
    },
    {
        id: "tips",
        name: "Trinkgeld",
        color: "#64b5f6",
        iconName: "hand-coins",
        kind: "expense",
        fallback: false,
    },
];

function expense(
    id: string,
    fields: Partial<Omit<Transaction, "id">> = {},
): Transaction {
    return {
        id,
        kind: "expense",
        amount: 10,
        currency: "EUR",
        counterparty: "Bäcker",
        description: null,
        date: day,
        categoryId: "restaurant",
        exceptional: false,
        location: null,
        mainExpenseId: null,
        ...fields,
    };
}

const meal = expense("meal", {
    counterparty: "Trattoria Luigi",
    description: "Pizza & Wein",
    amount: 15,
});
const tip = expense("tip", {
    counterparty: "Bedienung",
    description: "Trinkgeld",
    amount: 2.5,
    categoryId: "tips",
    mainExpenseId: "meal",
    // Older than its main expense, so it would sort above it on its own.
    date: day - 60 * 1000,
});
const bakery = expense("bakery", { amount: 3.2, date: day + 60 * 1000 });

/**
 * Renders the app at `url` with the October list (unless `null`) and search
 * results already in the cache. Requests `api` answers (by path, without the
 * query) get that JSON; the others never answer.
 */
async function renderApp(
    url: string,
    {
        transactions = [],
        search,
        api = {},
    }: {
        transactions?: Transaction[] | null;
        search?: { q: string; page: TransactionSearchPage };
        api?: Record<string, unknown>;
    },
) {
    vi.stubGlobal(
        "fetch",
        vi.fn((input: string) => {
            const path = new URL(input, "http://localhost").pathname;
            return path in api
                ? Promise.resolve(new Response(JSON.stringify(api[path])))
                : new Promise(() => undefined);
        }),
    );
    const queryClient = createQueryClient(() => undefined);
    registerTransactionMutations(queryClient, {
        onUnauthorized: () => undefined,
    });
    queryClient.setQueryData(sessionQuery.queryKey, () => ({
        id: "u1",
        username: "julian",
        role: null,
    }));
    queryClient.setQueryData(["categories"], categories);
    if (transactions) {
        queryClient.setQueryData(
            [
                "transactions",
                "list",
                { from: october.getTime(), to: endOfMonth(october).getTime() },
            ],
            transactions,
        );
    }
    if (search) {
        queryClient.setQueryData(
            ["transactions", "search", { q: search.q, older: "any" }],
            { pages: [search.page], pageParams: [undefined] },
        );
    }
    const router = createRouter({
        routeTree,
        context: { queryClient },
        history: createMemoryHistory({ initialEntries: [url] }),
    });
    render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>,
    );
    return {
        main: await screen.findByRole("main", {}, { timeout: 5000 }),

        /**
         * Queues a change like the form does; it stays pending.
         */
        queue: async (action: "save" | "delete", transaction: Transaction) => {
            await act(async () => {
                void new MutationObserver<unknown, Error, Transaction>(
                    queryClient,
                    { mutationKey: ["transactions", action] },
                ).mutate(transaction);
                await Promise.resolve();
            });
        },
    };
}

function row(main: HTMLElement, counterparty: string) {
    return within(main).findByRole("button", {
        name: new RegExp(counterparty),
    });
}

function isBelow(lower: HTMLElement, upper: HTMLElement) {
    return Boolean(
        upper.compareDocumentPosition(lower) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
}

beforeAll(() => {
    // jsdom lays nothing out; the month switcher scrolls its track.
    Element.prototype.scrollTo = () => undefined;
    window.scrollTo = () => undefined;
    // The form's chips and popovers measure themselves.
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("transaction list", () => {
    it("shows a regular expense with its amount", async () => {
        const { main } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery],
        });

        expect(await row(main, "Bäcker")).toHaveTextContent("3,20 €");
    });

    it("shows a main expense's own amount and the occasion's total", async () => {
        const { main } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery, meal, tip],
        });

        const mealRow = await row(main, "Trattoria Luigi");
        expect(mealRow).toHaveTextContent("15,00 €");
        expect(mealRow).toHaveTextContent("gesamt 17,50 €");
    });

    it("shows attached expenses right below their main expense", async () => {
        const { main } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery, meal, tip],
        });

        const attached = within(main).getByRole("group", {
            name: "Angehängt an Trattoria Luigi",
        });
        const tipRow = await row(attached, "Bedienung");
        expect(tipRow).toHaveTextContent("2,50 €");
        expect(tipRow).not.toHaveTextContent("gehört zu");
        expect(isBelow(tipRow, await row(main, "Trattoria Luigi"))).toBe(true);
        expect(
            isBelow(
                await row(main, "Trattoria Luigi"),
                await row(main, "Bäcker"),
            ),
        ).toBe(true);
    });

    it("hints at the main expense when the category filter hides it", async () => {
        const { main } = await renderApp(
            "/transactions?month=2026-10&category=tips",
            {
                transactions: [bakery, meal, tip],
            },
        );

        expect(await row(main, "Bedienung")).toHaveTextContent(
            "gehört zu Trattoria Luigi",
        );
        expect(
            within(main).queryByRole("button", { name: /^Trattoria Luigi/ }),
        ).toBeNull();
        expect(within(main).queryByRole("group")).toBeNull();
    });

    it("counts the whole occasion in the total when the category filter hides attached expenses", async () => {
        const water = expense("water", {
            counterparty: "Wasser",
            amount: 3,
            mainExpenseId: "meal",
        });
        const { main } = await renderApp(
            "/transactions?month=2026-10&category=restaurant",
            {
                transactions: [bakery, meal, tip, water],
            },
        );

        expect(await row(main, "Trattoria Luigi")).toHaveTextContent(
            "gesamt 20,50 €",
        );
    });
});

describe("pending changes", () => {
    it("turn the attached expenses of a deleted main expense into regular rows", async () => {
        const { main, queue } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery, meal, tip],
        });

        await queue("delete", meal);

        const tipRow = await row(main, "Bedienung");
        expect(tipRow).not.toHaveTextContent("gehört zu");
        expect(within(main).queryByRole("group")).toBeNull();
    });

    it("move attached expenses along with their main expense's date", async () => {
        const { main, queue } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery, meal, tip],
        });

        await queue("save", {
            ...meal,
            date: new Date(2026, 9, 3, 12).getTime(),
        });

        const day = (
            await within(main).findByRole("heading", { name: /03\. Oktober/ })
        ).closest("section")!;
        expect(
            within(day).getByRole("group", {
                name: "Angehängt an Trattoria Luigi",
            }),
        ).toHaveTextContent("Trinkgeld");
    });

    it("show an attached expense below its main expense right away", async () => {
        const { main, queue } = await renderApp("/transactions?month=2026-10", {
            transactions: [bakery, meal],
        });

        await queue("save", { ...tip, date: day - 5 * 24 * 60 * 60 * 1000 });

        expect(
            await row(
                await within(main).findByRole("group", {
                    name: "Angehängt an Trattoria Luigi",
                }),
                "Bedienung",
            ),
        ).toHaveTextContent("2,50 €");
    });
});

describe("search results", () => {
    it("hints at the main expense when it isn't among the results", async () => {
        const { main } = await renderApp("/transactions?q=Bedienung", {
            search: {
                q: "Bedienung",
                page: { items: [tip], nextCursor: null, mainExpenses: [meal] },
            },
        });

        expect(await row(main, "Bedienung")).toHaveTextContent(
            "gehört zu Trattoria Luigi",
        );
    });

    it("shows attached expenses below their main expense among the results", async () => {
        const { main } = await renderApp("/transactions?q=Trattoria", {
            search: {
                q: "Trattoria",
                page: {
                    items: [meal, tip],
                    nextCursor: null,
                    mainExpenses: [],
                },
            },
        });

        const attached = within(main).getByRole("group", {
            name: "Angehängt an Trattoria Luigi",
        });
        expect(await row(attached, "Bedienung")).not.toHaveTextContent(
            "gehört zu",
        );
        expect(await row(main, "Trattoria Luigi")).toHaveTextContent(
            "gesamt 17,50 €",
        );
    });
});

describe("transaction form", () => {
    async function renderForm(id: string) {
        await renderApp(`/edit/${id}`, { transactions: [bakery, meal, tip] });
        const save = await screen.findByRole("button", { name: "Speichern" });
        return save.closest("form")!;
    }

    it("locks an attached expense's date and kind", async () => {
        const form = await renderForm("tip");

        expect(
            within(form).getByRole("button", { name: "Einnahme" }),
        ).toBeDisabled();
        expect(
            within(form).getByRole("button", { name: "Heute" }),
        ).toBeDisabled();
        expect(form).toHaveTextContent(
            "Das Datum kommt von der Hauptausgabe Trattoria Luigi.",
        );
        expect(form).toHaveTextContent(
            "Löse die Ausgabe von ihrer Hauptausgabe, um sie zur Einnahme zu machen.",
        );
    });

    it("locks the kind of a main expense with attached expenses", async () => {
        const form = await renderForm("meal");

        expect(
            within(form).getByRole("button", { name: "Einnahme" }),
        ).toBeDisabled();
        expect(
            within(form).getByRole("button", { name: "Heute" }),
        ).toBeEnabled();
        expect(form).toHaveTextContent(
            "An dieser Ausgabe hängen andere Ausgaben, daher bleibt sie eine Ausgabe.",
        );
    });

    it("locks the kind of a main expense opened by a link to an uncached month", async () => {
        await renderApp("/edit/meal", {
            transactions: null,
            api: {
                "/api/transactions/meal": meal,
                "/api/transactions": [bakery, meal, tip],
            },
        });
        const save = await screen.findByRole(
            "button",
            { name: "Speichern" },
            { timeout: 5000 },
        );

        expect(
            within(save.closest("form")!).getByRole("button", {
                name: "Einnahme",
            }),
        ).toBeDisabled();
    });

    it("leaves a regular expense unlocked", async () => {
        const form = await renderForm("bakery");

        expect(
            within(form).getByRole("button", { name: "Einnahme" }),
        ).toBeEnabled();
    });
});
