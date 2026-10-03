import * as React from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/cn.ts";
import { outlinedTextFieldClassName } from "@/components/ui/input.tsx";

function Select({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
}) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                outlinedTextFieldClassName,
                `data-[placeholder]:text-on-surface-variant
                data-[state=open]:border-primary
                [&_svg:not([class*='text-'])]:text-on-surface-variant flex
                cursor-pointer items-center justify-between gap-2 text-left
                whitespace-nowrap data-[size=sm]:h-10
                *:data-[slot=select-value]:line-clamp-1
                *:data-[slot=select-value]:flex
                *:data-[slot=select-value]:items-center
                *:data-[slot=select-value]:gap-2 data-[state=open]:border-2
                data-[state=open]:px-[15px] [&_svg]:pointer-events-none
                [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6`,
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDownIcon />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    position = "item-aligned",
    align = "center",
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    `bg-surface-container text-on-surface
                    data-[side=bottom]:slide-in-from-top-2
                    data-[side=left]:slide-in-from-right-2
                    data-[side=right]:slide-in-from-left-2
                    data-[side=top]:slide-in-from-bottom-2
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=closed]:zoom-out-95 data-[state=open]:animate-in
                    data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
                    shadow-elevation-2 relative z-50
                    max-h-(--radix-select-content-available-height) min-w-[8rem]
                    origin-(--radix-select-content-transform-origin)
                    overflow-x-hidden overflow-y-auto rounded-xs`,
                    position === "popper" &&
                        `data-[side=bottom]:translate-y-1
                        data-[side=left]:-translate-x-1
                        data-[side=right]:translate-x-1
                        data-[side=top]:-translate-y-1`,
                    className,
                )}
                position={position}
                align={align}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        "py-2",
                        position === "popper" &&
                            `h-[var(--radix-select-trigger-height)] w-full
                            min-w-[var(--radix-select-trigger-width)]
                            scroll-my-1`,
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectLabel({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn(
                "text-on-surface-variant text-label-medium px-3 py-2",
                className,
            )}
            {...props}
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                `text-on-surface text-body-large focus:bg-on-surface/10
                data-[state=checked]:bg-secondary-container
                data-[state=checked]:text-on-secondary-container
                [&_svg:not([class*='text-'])]:text-on-surface-variant relative
                flex h-12 w-full cursor-pointer items-center gap-3 pr-10 pl-3
                outline-hidden select-none data-[disabled]:pointer-events-none
                data-[disabled]:opacity-38 [&_svg]:pointer-events-none
                [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
                *:[span]:last:flex *:[span]:last:items-center
                *:[span]:last:gap-2`,
                className,
            )}
            {...props}
        >
            <span
                data-slot="select-item-indicator"
                className="absolute right-3 flex size-6 items-center
                    justify-center"
            >
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-6" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(
                "bg-outline-variant pointer-events-none my-2 h-px",
                className,
            )}
            {...props}
        />
    );
}

function SelectScrollUpButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(
                "flex cursor-default items-center justify-center py-1",
                className,
            )}
            {...props}
        >
            <ChevronUpIcon className="size-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(
                "flex cursor-default items-center justify-center py-1",
                className,
            )}
            {...props}
        >
            <ChevronDownIcon className="size-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
