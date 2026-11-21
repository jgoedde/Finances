import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/cn.ts";

// Small status labels. For MD3 chips, use `components/ui/chip.tsx`.
const badgeVariants = cva(
    "focus-ring inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border whitespace-nowrap outline-none transition-colors duration-200 ease-standard [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary px-2 py-0.5 text-label-medium text-on-primary",
                secondary:
                    "border-transparent bg-secondary-container px-2 py-0.5 text-label-medium text-on-secondary-container",
                destructive:
                    "border-transparent bg-error px-2 py-0.5 text-label-medium text-on-error",
                outline:
                    "border-outline-variant px-2 py-0.5 text-label-medium text-on-surface-variant",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge };
