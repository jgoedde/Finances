import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn.ts";

// MD3 outlined text field container (https://m3.material.io/components/text-fields/specs).
// The 2dp focus border is compensated via padding so the text doesn't shift.
export const outlinedTextFieldClassName = `block h-14 w-full rounded-xs border
    border-outline bg-transparent px-4 text-body-large text-on-surface
    caret-primary outline-none transition-colors duration-150 ease-standard
    placeholder:text-on-surface-variant hover:border-on-surface
    focus:border-2 focus:border-primary focus:px-[15px]
    aria-invalid:border-error aria-invalid:caret-error
    disabled:pointer-events-none disabled:cursor-not-allowed
    disabled:border-on-surface/12 disabled:text-on-surface/38`;

const inputVariants = cva("", {
    variants: {
        variant: {
            default: outlinedTextFieldClassName,
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

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
