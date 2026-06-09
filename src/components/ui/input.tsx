import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
    "w-full disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "border-outline focus:border-primary mt-1 block h-10 rounded-xs border px-4 py-2 text-sm shadow-sm focus:border-2 focus:ring-0 focus:outline-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Input({
    className,
    type,
    variant,
    ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(inputVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Input };
