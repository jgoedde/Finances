import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages.js";

// The list itself is rendered by the `fixed-costs` layout.
export const Route = createFileRoute("/_authed/_shell/fixed-costs/")({
    head: () => ({
        meta: [{ title: m.page_title({ page: m.fixed_costs_title() }) }],
    }),
});
