import {
    type RegisteredRouter,
    type RouteIds,
    useMatches,
} from "@tanstack/react-router";
import ChartPie from "~icons/material-symbols/pie-chart-outline-rounded";
import ChartPieFilled from "~icons/material-symbols/pie-chart-rounded";
import ReceiptText from "~icons/material-symbols/receipt-long-outline-rounded";
import ReceiptTextFilled from "~icons/material-symbols/receipt-long-rounded";
import Repeat from "~icons/material-symbols/event-repeat-outline-rounded";
import RepeatFilled from "~icons/material-symbols/event-repeat-rounded";
import type { IconComponent } from "#/lib/icon.ts";
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
    icon: IconComponent;

    /**
     * Filled variant, shown while the destination is active.
     */
    activeIcon: IconComponent;
    label: () => string;
}

/**
 * The top-level destinations; settings sit apart at the bottom.
 */
export const DESTINATIONS: Destination[] = [
    {
        id: "overview",
        icon: ChartPie,
        activeIcon: ChartPieFilled,
        label: m.nav_overview,
    },
    {
        id: "transactions",
        icon: ReceiptText,
        activeIcon: ReceiptTextFilled,
        label: m.nav_transactions,
    },
    {
        id: "fixedCosts",
        icon: Repeat,
        activeIcon: RepeatFilled,
        label: m.fixed_costs_title,
    },
];
