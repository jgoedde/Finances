import { Settings } from "lucide-react";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { NewTransactionFAB } from "#/features/transactions/components/new-transaction-fab.tsx";
import { DrawerItem } from "#/features/navigation/drawer-item.tsx";
import { DESTINATIONS } from "#/features/navigation/destinations.ts";
import { m } from "#/paraglide/messages.js";

// https://m3.material.io/components/navigation-drawer/specs
export function NavigationDrawer() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`sticky top-0 hidden h-dvh w-72 shrink-0 flex-col gap-4
                bg-surface p-3 expanded:flex`}
        >
            <div className={"px-1 py-2"}>
                <NewTransactionFAB variant={"extended"} />
            </div>
            <div className={"flex min-h-0 flex-col overflow-y-auto"}>
                {DESTINATIONS.map(({ id, icon, label }) => (
                    <DrawerItem key={id} id={id} icon={icon} label={label()} />
                ))}
            </div>
            <div className={"mt-auto flex flex-col"}>
                <DrawerItem
                    id={"settings"}
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
