import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/cn.ts";

// MD3 switch (https://m3.material.io/components/switch/specs): 52x32dp track,
// thumb grows from 16dp (off) to 24dp (on) and 28dp while pressed.
function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                `peer group/switch focus-ring ease-standard
                data-[state=checked]:border-primary
                data-[state=checked]:bg-primary
                data-[state=unchecked]:border-outline
                data-[state=unchecked]:bg-surface-container-highest inline-flex
                h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full
                border-2 transition-colors duration-200 outline-none
                disabled:cursor-not-allowed disabled:opacity-38`,
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={`ease-standard data-[state=checked]:bg-on-primary
                    data-[state=unchecked]:bg-outline pointer-events-none block
                    size-4 rounded-full transition-all duration-200
                    group-active/switch:size-7 data-[state=checked]:size-6
                    data-[state=checked]:translate-x-[22px]
                    group-active/switch:data-[state=checked]:translate-x-5
                    data-[state=unchecked]:translate-x-[6px]
                    group-active/switch:data-[state=unchecked]:translate-x-0`}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
