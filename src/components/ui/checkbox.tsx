import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/cn.ts";

function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                `peer data-[state=checked]:bg-primary border-on-surface-variant
                focus-visible:border-ring focus-visible:ring-ring/50
                aria-invalid:ring-destructive/20
                dark:aria-invalid:ring-destructive/40
                aria-invalid:border-destructive
                data-[state=checked]:text-on-primary size-5 shrink-0
                rounded-[2px] border transition-shadow outline-none
                focus-visible:ring-[3px] disabled:cursor-not-allowed
                disabled:opacity-50 data-[state=checked]:border-none`,
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current
                    transition-none"
            >
                <CheckIcon className="size-4.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
