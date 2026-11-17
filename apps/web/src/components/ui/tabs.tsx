import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "#/lib/cn.ts";

// MD3 primary tabs (https://m3.material.io/components/tabs/specs): equal
// width, label in primary with a 3dp indicator under the active tab.
function Tabs({ ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "flex border-b border-surface-container-highest",
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                `group/tab state-layer flex h-12 flex-1 cursor-pointer
                items-center justify-center px-4 text-title-small
                text-on-surface-variant focus-ring outline-none
                data-[state=active]:text-primary`,
                className,
            )}
            {...props}
        >
            <span className="relative flex h-full items-center">
                {children}
                <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 hidden h-[3px]
                        rounded-t-full bg-primary
                        group-data-[state=active]/tab:block`}
                />
            </span>
        </TabsPrimitive.Trigger>
    );
}

export { Tabs, TabsList, TabsTrigger };
