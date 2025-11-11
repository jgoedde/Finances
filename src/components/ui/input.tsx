import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
    "w-full disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                md3: "border-outline focus:border-primary mt-1 block h-10 rounded-xs border px-4 py-2 text-sm shadow-sm focus:border-2 focus:ring-0 focus:outline-none",
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
