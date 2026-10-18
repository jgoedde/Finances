import { DestinationLink } from "#/features/navigation/destination-link.tsx";
import { ActiveIndicator } from "#/features/navigation/active-indicator.tsx";
import { DESTINATIONS } from "#/features/navigation/destinations.ts";
import { m } from "#/paraglide/messages.js";

// https://m3.material.io/components/navigation-bar/specs
export function NavigationBar() {
    return (
        <nav
            aria-label={m.nav_label()}
            className={`fixed inset-x-0 bottom-0 z-20 flex bg-surface-container
                pb-[env(safe-area-inset-bottom)] medium:hidden`}
        >
            {DESTINATIONS.map(({ id, icon: Icon, label }) => (
                <DestinationLink
                    key={id}
                    id={id}
                    className={`group flex h-20 min-w-0 flex-1 flex-col
                    items-center justify-center gap-1 text-label-medium
                    text-on-surface-variant focus-ring
                    data-active:text-on-surface`}
                >
                    <ActiveIndicator className={"w-16"}>
                        <Icon />
                    </ActiveIndicator>
                    <span className={"max-w-full truncate px-1"}>
                        {label()}
                    </span>
                </DestinationLink>
            ))}
        </nav>
    );
}
