import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import CheckIcon from "~icons/material-symbols/check-rounded";
import { cn } from "#/lib/cn.ts";
import * as haptics from "#/lib/haptics.ts";

function RadioGroup({
    className,
    onValueChange,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn("grid gap-3", className)}
            {...props}
            onValueChange={(value) => {
                haptics.tick();
                onValueChange?.(value);
            }}
        />
    );
}

// MD3 radio button (https://m3.material.io/components/radio-button/specs):
// 20dp ring with 2dp on-surface-variant border, primary with 10dp dot when selected.
function RadioGroupItem({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                `aspect-square size-5 shrink-0 cursor-pointer rounded-full
                border-2 border-on-surface-variant focus-ring transition-colors
                duration-150 ease-standard outline-none
                disabled:cursor-not-allowed disabled:border-on-surface/38
                aria-invalid:border-error data-[state=checked]:border-primary`,
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="flex size-full items-center justify-center"
            >
                <span className="size-2.5 rounded-full bg-primary" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

// A color choice: a 40dp circle in `--tone` (set it with the `tone` utility's
// style) with a check in `--on-tone` when selected.
function RadioGroupSwatch({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-swatch"
            className={cn(
                `state-layer flex size-10 shrink-0 cursor-pointer items-center
                justify-center rounded-full bg-(--tone) text-(--on-tone)
                focus-ring tone outline-none disabled:cursor-not-allowed
                disabled:opacity-38`,
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator">
                <CheckIcon className="size-5" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

// An icon choice: a 48dp square showing its children (an icon), filled in
// secondary-container when selected.
function RadioGroupIconItem({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-icon-item"
            className={cn(
                `state-layer flex size-12 shrink-0 cursor-pointer items-center
                justify-center rounded-md text-on-surface-variant focus-ring
                outline-none disabled:cursor-not-allowed disabled:opacity-38
                data-[state=checked]:bg-secondary-container
                data-[state=checked]:text-on-secondary-container [&_svg]:size-6`,
                className,
            )}
            {...props}
        />
    );
}

export { RadioGroup, RadioGroupIconItem, RadioGroupItem, RadioGroupSwatch };
