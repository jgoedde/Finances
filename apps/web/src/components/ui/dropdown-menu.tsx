import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "#/lib/cn.ts";

// MD3 menu (https://m3.material.io/components/menus/specs).

function DropdownMenu({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return (
        <DropdownMenuPrimitive.Trigger
            data-slot="dropdown-menu-trigger"
            {...props}
        />
    );
}

function DropdownMenuContent({
    className,
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    `z-50 max-h-(--radix-dropdown-menu-content-available-height)
                    max-w-[280px] min-w-[112px]
                    origin-(--radix-dropdown-menu-content-transform-origin)
                    overflow-y-auto rounded-xs bg-surface-container py-2
                    text-on-surface shadow-elevation-2
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=closed]:zoom-out-95 data-[state=open]:animate-in
                    data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

const itemClassName = `state-layer relative flex h-12 cursor-pointer items-center
    gap-3 px-3 text-label-large outline-hidden select-none
    data-[disabled]:pointer-events-none data-[disabled]:text-on-surface/38
    [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-on-surface-variant
    [&_svg:not([class*='size-'])]:size-6`;

function DropdownMenuItem({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            className={cn(itemClassName, className)}
            {...props}
        />
    );
}

function DropdownMenuRadioGroup({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    return (
        <DropdownMenuPrimitive.RadioGroup
            data-slot="dropdown-menu-radio-group"
            {...props}
        />
    );
}

// Leading MD3 radio button, like `RadioGroupItem`.
function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            className={cn(itemClassName, "group/radio", className)}
            {...props}
        >
            <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center
                    rounded-full border-2 border-on-surface-variant
                    transition-colors duration-150 ease-standard
                    group-data-[state=checked]/radio:border-primary`}
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <span
                        className={"block size-2.5 rounded-full bg-primary"}
                    />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            className={cn(
                "px-3 py-2 text-label-medium text-on-surface-variant",
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn("my-2 h-px bg-outline-variant", className)}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
};
