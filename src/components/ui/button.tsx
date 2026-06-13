import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn.ts";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 text-sm whitespace-nowrap [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                outline: "outline-variant outline text-on-surface-variant",
                filled: "bg-primary text-on-primary outline-none",
                filledTonal:
                    "bg-secondary-container text-on-secondary-container outline-none",
                ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 outline-none",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
            shape: {
                round: "rounded-full",
                square: "rounded-md",
            },
        },
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
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
