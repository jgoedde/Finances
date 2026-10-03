import { CurrencyInput } from "react-currency-input-field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn.ts";
import { outlinedTextFieldClassName } from "@/components/ui/input.tsx";

export function CurrencyInputWrapper({
    className,
    ...props
}: ComponentProps<typeof CurrencyInput> & {
    className?: ComponentProps<"input">["className"];
}) {
    return (
        <CurrencyInput
            className={cn(outlinedTextFieldClassName, className)}
            {...props}
        />
    );
}
