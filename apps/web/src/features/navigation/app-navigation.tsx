import { Link, type LinkProps } from "@tanstack/react-router";
import { ChartPie, ReceiptText, Repeat, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface Destination {
    to: LinkProps["to"];
    icon: LucideIcon;
    label: () => string;
}

const DESTINATIONS: Destination[] = [
    { to: "/", icon: ChartPie, label: m.nav_overview },
    { to: "/transactions", icon: ReceiptText, label: m.nav_transactions },
    { to: "/fixed-costs", icon: Repeat, label: m.fixed_costs_title },
];

// The month param is kept by the shell route, so it isn't compared here.
const ACTIVE_OPTIONS = { exact: true, includeSearch: false } as const;

/**
 * MD3 navigation per window size class: navigation bar (compact),
 * navigation rail (medium), permanent navigation drawer (expanded).
 */
export function AppNavigation() {
    return (
        <>
            <NavigationBar />
            <NavigationRail />
            <NavigationDrawer />
        </>
    );
}

// https://m3.material.io/components/navigation-bar/specs
function NavigationBar() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`fixed inset-x-0 bottom-0 z-20 flex bg-surface-container
                pb-[env(safe-area-inset-bottom)] medium:hidden`}
        >
            {DESTINATIONS.map(({ to, icon: Icon, label }) => (
                <Link
                    key={to}
                    to={to}
                    activeOptions={ACTIVE_OPTIONS}
                    className={`group flex h-20 min-w-0 flex-1 flex-col
                    items-center justify-center gap-1 text-label-medium
                    text-on-surface-variant focus-ring
                    data-[status=active]:text-on-surface`}
                >
                    <ActiveIndicator className={"w-16"}>
                        <Icon />
                    </ActiveIndicator>
                    <span className={"max-w-full truncate px-1"}>
                        {label()}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

// https://m3.material.io/components/navigation-rail/specs
function NavigationRail() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`sticky top-0 hidden h-dvh w-20 shrink-0 flex-col
                items-center gap-10 bg-surface py-4 medium:flex expanded:hidden`}
        >
            <NewTransactionFAB variant={"rail"} />
            <div className={"flex flex-col gap-3"}>
                {DESTINATIONS.map(({ to, icon: Icon, label }) => (
                    <Link
                        key={to}
                        to={to}
                        activeOptions={ACTIVE_OPTIONS}
                        className={`group flex w-20 flex-col items-center gap-1
                        text-center text-label-medium text-on-surface-variant
                        focus-ring data-[status=active]:text-on-surface`}
                    >
                        <ActiveIndicator className={"w-14"}>
                            <Icon />
                        </ActiveIndicator>
                        <span className={"px-1"}>{label()}</span>
                    </Link>
                ))}
            </div>
            <div className={"mt-auto flex flex-col items-center gap-2"}>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.settings_title()}
                    asChild
                >
                    <Link to={"/settings"}>
                        <Settings />
                    </Link>
                </Button>
                <AccountMenu side={"right"} />
            </div>
        </nav>
    );
}

// https://m3.material.io/components/navigation-drawer/specs
function NavigationDrawer() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-4
                bg-surface p-3 expanded:flex`}
        >
            <div className={"px-1 py-2"}>
                <NewTransactionFAB variant={"extended"} />
            </div>
            <div className={"flex flex-col"}>
                {DESTINATIONS.map(({ to, icon: Icon, label }) => (
                    <DrawerItem key={to} to={to} icon={Icon} label={label()} />
                ))}
            </div>
            <div className={"mt-auto flex flex-col"}>
                <DrawerItem
                    to={"/settings"}
                    icon={Settings}
                    label={m.settings_title()}
                />
                <div className={"flex items-center gap-1 px-1"}>
                    <AccountMenu side={"right"} />
                </div>
            </div>
        </nav>
    );
}

function DrawerItem({
    to,
    icon: Icon,
    label,
}: {
    to: LinkProps["to"];
    icon: LucideIcon;
    label: string;
}) {
    return (
        <Link
            to={to}
            activeOptions={ACTIVE_OPTIONS}
            className={`state-layer flex h-14 items-center gap-3 rounded-full
                px-4 text-label-large text-on-surface-variant focus-ring
                data-[status=active]:bg-secondary-container
                data-[status=active]:text-on-secondary-container [&_svg]:size-6`}
        >
            <Icon />
            {label}
        </Link>
    );
}

/** The pill behind a bar or rail icon; filled when its link is active. */
function ActiveIndicator({
    className,
    children,
}: {
    className: string;
    children: ReactNode;
}) {
    return (
        <span
            className={cn(
                `state-layer flex h-8 items-center justify-center rounded-full
                group-data-[status=active]:bg-secondary-container
                group-data-[status=active]:text-on-secondary-container
                [&_svg]:size-6`,
                className,
            )}
        >
            {children}
        </span>
    );
}
