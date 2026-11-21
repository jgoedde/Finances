import type { IconComponent } from "#/lib/icon.ts";

interface DestinationIconProps {
    icon: IconComponent;
    activeIcon: IconComponent;
}

/**
 * A destination's icon: outlined, filled while the destination is active
 * (MD3). Needs a `group` ancestor with `data-active`, like `DestinationLink`.
 */
export function DestinationIcon({
    icon: Icon,
    activeIcon: ActiveIcon,
}: DestinationIconProps) {
    return (
        <>
            <Icon aria-hidden className={"group-data-active:hidden"} />
            <ActiveIcon
                aria-hidden
                className={"hidden group-data-active:block"}
            />
        </>
    );
}
