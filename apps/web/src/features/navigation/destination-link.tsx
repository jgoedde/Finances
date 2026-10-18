import type { PropsWithChildren } from "react";
import { Link } from "@tanstack/react-router";
import {
    type DestinationId,
    useActiveDestination,
} from "#/features/navigation/destinations.ts";

interface DestinationLinkProps {
    id: DestinationId;
    className: string;
    "aria-label"?: string;
}

/**
 * Link to a destination, with `data-active` while it's showing. The month
 * carries over (see the shell route); filters and search of the
 * transaction list are reset.
 */
export function DestinationLink({
    id,
    className,
    children,
    ...props
}: PropsWithChildren<DestinationLinkProps>) {
    const isActive = useActiveDestination() === id;
    const common = {
        className,
        "data-active": isActive || undefined,
        "aria-current": isActive ? ("page" as const) : undefined,
        ...props,
    };
    switch (id) {
        case "overview":
            return (
                <Link to={"/"} {...common}>
                    {children}
                </Link>
            );
        case "transactions":
            return (
                <Link
                    to={"/transactions"}
                    search={{
                        category: undefined,
                        q: undefined,
                        older: undefined,
                    }}
                    {...common}
                >
                    {children}
                </Link>
            );
        case "fixedCosts":
            return (
                <Link to={"/fixed-costs"} {...common}>
                    {children}
                </Link>
            );
        case "settings":
            return (
                <Link to={"/settings"} {...common}>
                    {children}
                </Link>
            );
    }
}
