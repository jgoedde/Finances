import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "#/lib/cn.ts";
import {
    menuContentClassName,
    menuItemClassName,
    menuItemSelectedClassName,
} from "#/components/ui/menu-styles.ts";

// MD3 Expressive vertical menu (https://m3.material.io/components/menus/specs).

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
                    menuContentClassName,
                    `max-h-(--radix-dropdown-menu-content-available-height)
                    origin-(--radix-dropdown-menu-content-transform-origin)`,
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuItem({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            className={cn(menuItemClassName, className)}
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

// Leading MD3 radio button, like `RadioGroupItem`; the checked item gets the
// selected container.
function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            className={cn(
                menuItemClassName,
                menuItemSelectedClassName,
                "group/radio",
                className,
            )}
            {...props}
        >
            <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center
                    rounded-full border-2 border-on-surface-variant
                    transition-colors duration-150 ease-standard
                    group-data-[state=checked]/radio:border-on-tertiary-container`}
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <span
                        className={
                            "block size-2.5 rounded-full bg-on-tertiary-container"
                        }
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
                "px-4 py-2 text-label-medium text-on-surface-variant",
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
            className={cn("my-1.5 h-px shrink-0 bg-outline-variant", className)}
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
