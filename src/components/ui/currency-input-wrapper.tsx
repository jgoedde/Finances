import { CurrencyInput } from "react-currency-input-field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn.ts";

export function CurrencyInputWrapper({
    className,
    ...props
}: ComponentProps<typeof CurrencyInput> & {
    className?: ComponentProps<"input">["className"];
}) {
    return (
        <CurrencyInput
            className={cn(
                `border-outline focus:border-primary mt-1 block h-10 w-full
                rounded-xs border px-4 py-2 text-sm shadow-sm focus:border-2
                focus:ring-0 focus:outline-none disabled:pointer-events-none
                disabled:cursor-not-allowed disabled:opacity-50`,
                className,
            )}
            {...props}
        />
    );
}
