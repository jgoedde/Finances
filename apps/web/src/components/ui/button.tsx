import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn.ts";

// MD3 common buttons (https://m3.material.io/components/buttons/specs)
// and icon buttons (size="icon").
const buttonVariants = cva(
    "state-layer focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 text-label-large whitespace-nowrap outline-none transition-shadow duration-200 ease-standard disabled:pointer-events-none disabled:text-on-surface/38 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
    {
        variants: {
            variant: {
                filled: "bg-primary text-on-primary hover:shadow-elevation-1 disabled:bg-on-surface/12 disabled:shadow-none",
                filledTonal:
                    "bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 disabled:bg-on-surface/12 disabled:shadow-none",
                elevated:
                    "bg-surface-container-low text-primary shadow-elevation-1 hover:shadow-elevation-2 disabled:bg-on-surface/12 disabled:shadow-none",
                outline:
                    "border border-outline text-primary disabled:border-on-surface/12",
                text: "text-primary",
                // Standard icon button / neutral action without container.
                ghost: "text-on-surface-variant",
            },
            size: {
                default: "h-10 px-6 has-[>svg]:pr-6 has-[>svg]:pl-4",
                sm: "h-8 gap-1.5 px-4 has-[>svg]:pr-4 has-[>svg]:pl-3",
                lg: "h-12 px-8 has-[>svg]:pr-8 has-[>svg]:pl-6",
                icon: "size-10 [&_svg:not([class*='size-'])]:size-6",
            },
            shape: {
                round: "rounded-full",
                square: "rounded-md",
            },
        },
        compoundVariants: [
            // Text buttons use tighter padding per spec.
            {
                variant: "text",
                size: "default",
                className: "px-3 has-[>svg]:pr-4 has-[>svg]:pl-3",
            },
        ],
        defaultVariants: {
            variant: "filledTonal",
            size: "default",
            shape: "round",
        },
    },
);

function Button({
    className,
    variant,
    size,
    shape,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, shape, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
