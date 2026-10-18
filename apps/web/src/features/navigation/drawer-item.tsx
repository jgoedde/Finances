import type { LucideIcon } from "lucide-react";
import { DestinationLink } from "#/features/navigation/destination-link.tsx";
import type { DestinationId } from "#/features/navigation/destinations.ts";

interface DrawerItemProps {
    id: DestinationId;
    icon: LucideIcon;
    label: string;
}

export function DrawerItem({ id, icon: Icon, label }: DrawerItemProps) {
    return (
        <DestinationLink
            id={id}
            className={`state-layer flex h-14 shrink-0 items-center gap-3
                rounded-full px-4 text-label-large text-on-surface-variant
                focus-ring data-active:bg-secondary-container
                data-active:text-on-secondary-container [&_svg]:size-6`}
        >
            <Icon />
            {label}
        </DestinationLink>
    );
}
