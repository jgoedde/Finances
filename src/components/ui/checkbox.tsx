import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/cn.ts";

// MD3 checkbox (https://m3.material.io/components/checkbox/specs): 18dp box,
// 2dp corner, 2dp on-surface-variant border; filled primary when checked.
function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                `peer focus-ring border-on-surface-variant ease-standard
                disabled:border-on-surface/38 aria-invalid:border-error
                data-[state=checked]:border-primary
                data-[state=checked]:bg-primary
                data-[state=checked]:text-on-primary
                aria-invalid:data-[state=checked]:border-error
                aria-invalid:data-[state=checked]:bg-error
                disabled:data-[state=checked]:bg-on-surface/38 size-[18px]
                shrink-0 cursor-pointer rounded-[2px] border-2 transition-colors
                duration-150 outline-none disabled:cursor-not-allowed
                disabled:data-[state=checked]:border-transparent`,
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current"
            >
                <CheckIcon className="size-3.5" strokeWidth={3} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
