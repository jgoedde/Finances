import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn.ts";

function RadioGroup({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn("grid gap-3", className)}
            {...props}
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
                `focus-ring border-on-surface-variant ease-standard
                disabled:border-on-surface/38 aria-invalid:border-error
                data-[state=checked]:border-primary aspect-square size-5
                shrink-0 cursor-pointer rounded-full border-2 transition-colors
                duration-150 outline-none disabled:cursor-not-allowed`,
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="flex size-full items-center justify-center"
            >
                <span className="bg-primary size-2.5 rounded-full" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

export { RadioGroup, RadioGroupItem };
