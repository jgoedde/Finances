import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/cn.ts";

function Accordion({
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
    return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
    className,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn(
                "border-b border-outline-variant last:border-b-0",
                className,
            )}
            {...props}
        />
    );
}

function AccordionTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    `state-layer flex min-h-12 flex-1 cursor-pointer
                    items-center justify-between gap-4 rounded-xs text-left
                    text-title-small text-on-surface focus-ring outline-none
                    disabled:pointer-events-none disabled:opacity-38
                    [&[data-state=open]>svg]:rotate-180`,
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDownIcon
                    className="pointer-events-none size-6 shrink-0
                        text-on-surface-variant transition-transform
                        duration-300 ease-emphasized"
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="overflow-hidden text-body-medium
                data-[state=closed]:animate-accordion-up
                data-[state=open]:animate-accordion-down"
            {...props}
        >
            <div className={cn("pt-0 pb-4", className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
