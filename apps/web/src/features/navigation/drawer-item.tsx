import type { IconComponent } from "#/lib/icon.ts";
import { DestinationLink } from "#/features/navigation/destination-link.tsx";
import { DestinationIcon } from "#/features/navigation/destination-icon.tsx";
import type { DestinationId } from "#/features/navigation/destinations.ts";

interface DrawerItemProps {
    id: DestinationId;
    icon: IconComponent;
    activeIcon: IconComponent;
    label: string;
}

export function DrawerItem({ id, icon, activeIcon, label }: DrawerItemProps) {
    return (
        <DestinationLink
            id={id}
            className={`group state-layer flex h-14 shrink-0 items-center gap-3
                rounded-full px-4 text-label-large text-on-surface-variant
                focus-ring data-active:bg-secondary-container
                data-active:text-on-secondary-container [&_svg]:size-6`}
        >
            <DestinationIcon icon={icon} activeIcon={activeIcon} />
            {label}
        </DestinationLink>
    );
}
