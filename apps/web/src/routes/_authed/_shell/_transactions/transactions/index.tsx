import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages.js";

// The list itself is rendered by the `_transactions` layout.
export const Route = createFileRoute(
    "/_authed/_shell/_transactions/transactions/",
)({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.nav_transactions() }) }],
    }),
});
