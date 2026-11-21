import * as React from "react";
import { cn } from "#/lib/cn.ts";

// Port of shadcn's Empty (https://ui.shadcn.com/docs/components/radix/empty)
// to MD3: the icon sits in a round tonal container, title and description
// use the type scale. `size="compact"` fits inside a card.

/**
 * An empty state: icon, title, description and optional actions, centered.
 */
function Empty({
    className,
    size = "default",
    ...props
}: React.ComponentProps<"div"> & { size?: "default" | "compact" }) {
    return (
        <div
            data-slot="empty"
            data-size={size}
            className={cn(
                `group/empty flex min-w-0 flex-1 flex-col items-center
                justify-center gap-6 px-6 py-12 text-center text-balance
                data-[size=compact]:gap-4 data-[size=compact]:px-4
                data-[size=compact]:py-6`,
                className,
            )}
            {...props}
        />
    );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-header"
            className={cn(
                "flex max-w-sm flex-col items-center gap-2 text-center",
                className,
            )}
            {...props}
        />
    );
}

/**
 * The state's icon in a round secondary container.
 */
function EmptyMedia({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-icon"
            aria-hidden
            className={cn(
                `mb-2 flex size-20 shrink-0 items-center justify-center
                rounded-full bg-secondary-container
                text-on-secondary-container
                group-data-[size=compact]/empty:mb-1
                group-data-[size=compact]/empty:size-14
                [&_svg]:pointer-events-none [&_svg]:shrink-0
                [&_svg:not([class*='size-'])]:size-10
                group-data-[size=compact]/empty:[&_svg:not([class*='size-'])]:size-7`,
                className,
            )}
            {...props}
        />
    );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-title"
            className={cn(
                `font-brand text-title-large text-on-surface
                group-data-[size=compact]/empty:text-title-medium`,
                className,
            )}
            {...props}
        />
    );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="empty-description"
            className={cn(
                `text-body-medium text-on-surface-variant
                [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4`,
                className,
            )}
            {...props}
        />
    );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-content"
            className={cn(
                "flex w-full max-w-sm min-w-0 flex-col items-center gap-4",
                className,
            )}
            {...props}
        />
    );
}

export {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
};
