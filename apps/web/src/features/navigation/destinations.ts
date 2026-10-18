import {
    type RegisteredRouter,
    type RouteIds,
    useMatches,
} from "@tanstack/react-router";
import { ChartPie, ReceiptText, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { m } from "#/paraglide/messages.js";

export type DestinationId =
    "overview" | "transactions" | "fixedCosts" | "settings";

/**
 * Which destination a route belongs to, by its id.
 */
const DESTINATION_ROUTES = {
    overview: "/_authed/_shell/",
    // Also active while a transaction is created or edited.
    transactions: "/_authed/_shell/_transactions",
    // Also active while a fixed cost is created or edited.
    fixedCosts: "/_authed/_shell/fixed-costs",
    settings: "/_authed/_shell/settings",
} as const satisfies Record<
    DestinationId,
    RouteIds<RegisteredRouter["routeTree"]>
>;

export function useActiveDestination(): DestinationId | undefined {
    return useMatches({
        select: (matches) =>
            (Object.keys(DESTINATION_ROUTES) as DestinationId[]).find((id) =>
                matches.some(
                    (match) => match.routeId === DESTINATION_ROUTES[id],
                ),
            ),
    });
}

interface Destination {
    id: Exclude<DestinationId, "settings">;
    icon: LucideIcon;
    label: () => string;
}

/**
 * The top-level destinations; settings sit apart at the bottom.
 */
export const DESTINATIONS: Destination[] = [
    { id: "overview", icon: ChartPie, label: m.nav_overview },
    { id: "transactions", icon: ReceiptText, label: m.nav_transactions },
    { id: "fixedCosts", icon: Repeat, label: m.fixed_costs_title },
];
