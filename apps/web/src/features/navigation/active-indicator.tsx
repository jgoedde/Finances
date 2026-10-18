import type { PropsWithChildren } from "react";
import { cn } from "#/lib/cn.ts";

interface ActiveIndicatorProps {
    className: string;
}

/**
 * The pill behind a bar or rail icon; filled while its `group` link is
 * active.
 */
export function ActiveIndicator({
    className,
    children,
}: PropsWithChildren<ActiveIndicatorProps>) {
    return (
        <span
            className={cn(
                `state-layer flex h-8 items-center justify-center rounded-full
                group-data-active:bg-secondary-container
                group-data-active:text-on-secondary-container [&_svg]:size-6`,
                className,
            )}
        >
            {children}
        </span>
    );
}
