import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { cn } from "#/lib/cn.ts";
import {
    menuContentClassName,
    menuItemClassName,
} from "#/components/ui/menu-styles.ts";

// MD3 menu opened by a long press (touch) or a right click.

function ContextMenu({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return (
        <ContextMenuPrimitive.Trigger
            data-slot="context-menu-trigger"
            // A long press would otherwise select text or show the browser's
            // own callout.
            className={cn(
                "select-none [-webkit-touch-callout:none]",
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuContent({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                data-slot="context-menu-content"
                className={cn(
                    menuContentClassName,
                    `max-h-(--radix-context-menu-content-available-height)
                    origin-(--radix-context-menu-content-transform-origin)`,
                    className,
                )}
                {...props}
            />
        </ContextMenuPrimitive.Portal>
    );
}

function ContextMenuItem({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item>) {
    return (
        <ContextMenuPrimitive.Item
            data-slot="context-menu-item"
            className={cn(menuItemClassName, className)}
            {...props}
        />
    );
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem };
