import { Settings } from "lucide-react";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";
import { DestinationLink } from "#/features/navigation/destination-link.tsx";
import { ActiveIndicator } from "#/features/navigation/active-indicator.tsx";
import { DESTINATIONS } from "#/features/navigation/destinations.ts";
import { m } from "#/paraglide/messages.js";

// https://m3.material.io/components/navigation-rail/specs
export function NavigationRail() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`sticky top-0 hidden h-dvh w-20 shrink-0 flex-col
                items-center gap-10 bg-surface py-4 medium:flex expanded:hidden`}
        >
            <NewTransactionFAB variant={"rail"} />
            <div className={"flex flex-col gap-3"}>
                {DESTINATIONS.map(({ id, icon: Icon, label }) => (
                    <DestinationLink
                        key={id}
                        id={id}
                        className={`group flex w-20 flex-col items-center gap-1
                        text-center text-label-medium text-on-surface-variant
                        focus-ring data-active:text-on-surface`}
                    >
                        <ActiveIndicator className={"w-14"}>
                            <Icon />
                        </ActiveIndicator>
                        <span className={"px-1"}>{label()}</span>
                    </DestinationLink>
                ))}
            </div>
            <div className={"mt-auto flex flex-col items-center gap-2"}>
                <DestinationLink
                    id={"settings"}
                    aria-label={m.settings_title()}
                    className={`state-layer flex size-10 items-center
                        justify-center rounded-full text-on-surface-variant
                        focus-ring data-active:bg-secondary-container
                        data-active:text-on-secondary-container [&_svg]:size-6`}
                >
                    <Settings />
                </DestinationLink>
                <AccountMenu side={"right"} />
            </div>
        </nav>
    );
}
