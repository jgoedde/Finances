import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import CheckIcon from "~icons/material-symbols/check-rounded";
import { cn } from "#/lib/cn.ts";
import * as haptics from "#/lib/haptics.ts";

/*
 * MD3 switch (https://m3.material.io/components/switch/specs):
 */
function Switch({
    className,
    onCheckedChange,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                `peer group/switch relative inline-flex h-8 w-[52px] shrink-0
                cursor-pointer items-center rounded-full border-2 focus-ring
                transition-colors duration-200 ease-standard outline-none
                after:absolute after:inset-x-0 after:top-1/2 after:h-12
                after:-translate-y-1/2 disabled:pointer-events-none
                data-[state=checked]:border-primary
                data-[state=checked]:bg-primary
                disabled:data-[state=checked]:border-transparent
                disabled:data-[state=checked]:bg-on-surface/12
                data-[state=unchecked]:border-outline
                data-[state=unchecked]:bg-surface-container-highest
                disabled:data-[state=unchecked]:border-on-surface/12
                disabled:data-[state=unchecked]:bg-surface-container-highest/12`,
                className,
            )}
            {...props}
            onCheckedChange={(checked) => {
                haptics.tick();
                onCheckedChange?.(checked);
            }}
        >
            {/* 40dp state layer, centered on the handle (16dp from the track edge) */}
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={`pointer-events-none relative flex size-10 shrink-0
                    items-center justify-center rounded-full
                    transition-[translate,background-color] duration-200
                    ease-standard before:absolute before:inset-0
                    before:rounded-full before:opacity-0
                    before:transition-opacity before:duration-150
                    before:ease-standard group-hover/switch:before:opacity-8
                    group-focus-visible/switch:before:opacity-10
                    group-active/switch:before:opacity-10
                    data-[state=checked]:translate-x-[14px]
                    data-[state=checked]:before:bg-primary
                    data-[state=unchecked]:-translate-x-[6px]
                    data-[state=unchecked]:before:bg-on-surface`}
            >
                <span
                    data-slot="switch-handle"
                    className={`relative flex size-4 items-center justify-center
                        rounded-full transition-all duration-200 ease-standard
                        group-active/switch:size-7
                        group-data-[state=checked]/switch:size-6
                        group-data-[state=checked]/switch:bg-on-primary
                        group-data-[state=checked]/switch:text-on-primary-container
                        group-data-[state=checked]/switch:group-hover/switch:bg-primary-container
                        group-data-[state=checked]/switch:group-focus-visible/switch:bg-primary-container
                        group-data-[state=checked]/switch:group-active/switch:size-7
                        group-data-[state=checked]/switch:group-active/switch:bg-primary-container
                        group-data-[state=checked]/switch:group-disabled/switch:bg-surface
                        group-data-[state=checked]/switch:group-disabled/switch:text-on-surface/38
                        group-data-[state=unchecked]/switch:bg-outline
                        group-data-[state=unchecked]/switch:group-hover/switch:bg-on-surface-variant
                        group-data-[state=unchecked]/switch:group-focus-visible/switch:bg-on-surface-variant
                        group-data-[state=unchecked]/switch:group-active/switch:bg-on-surface-variant
                        group-data-[state=unchecked]/switch:group-disabled/switch:bg-on-surface/38`}
                >
                    <CheckIcon
                        aria-hidden
                        className={`size-4 opacity-0 transition-opacity
                            duration-200 ease-standard
                            group-data-[state=checked]/switch:opacity-100`}
                    />
                </span>
            </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
    );
}

export { Switch };
