import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/cn.ts";

// MD3 cards (https://m3.material.io/components/cards/specs).
const cardVariants = cva(
    "text-on-surface flex flex-col gap-6 rounded-md py-6",
    {
        variants: {
            variant: {
                elevated: "bg-surface-container-low shadow-elevation-1",
                filled: "bg-surface-container-highest",
                outlined: "bg-surface border border-outline-variant",
            },
        },
        defaultVariants: {
            variant: "filled",
        },
    },
);

function Card({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
    return (
        <div
            data-slot="card"
            className={cn(cardVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Card };
