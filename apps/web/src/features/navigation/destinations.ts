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
 * Which destination a route belongs to, by the ids of its routes.
 */
const DESTINATION_ROUTES = {
    overview: ["/_authed/_shell/"],
    // Also active while a transaction is created or edited.
    transactions: ["/_authed/_shell/_transactions"],
    // Also active while a fixed cost is created or edited.
    fixedCosts: ["/_authed/_shell/fixed-costs"],
    // The administration opens from the settings.
    settings: ["/_authed/_shell/settings", "/_authed/_shell/admin"],
} as const satisfies Record<
    DestinationId,
    readonly RouteIds<RegisteredRouter["routeTree"]>[]
>;

export function useActiveDestination(): DestinationId | undefined {
    return useMatches({
        select: (matches) =>
            (Object.keys(DESTINATION_ROUTES) as DestinationId[]).find((id) =>
                matches.some((match) =>
                    (DESTINATION_ROUTES[id] as readonly string[]).includes(
                        match.routeId,
                    ),
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
