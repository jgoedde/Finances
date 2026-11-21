import type { Ref } from "react";
import { formatCurrency } from "@finances/shared";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import { AMOUNT_ERROR_ID } from "#/features/transactions/components/form/transaction-form-model.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface AmountInputProps {
    ref?: Ref<HTMLInputElement>;
    value: string;
    onChange: (value: string) => void;
    isMissing: boolean;
    autoFocus: boolean;

    /**
     * The counterparty's last amount, shown as the placeholder.
     */
    lastAmount: number | undefined;
}

/**
 * The transaction's amount. Its hints render separately in
 * {@link AmountHints}, so the input can share a row.
 */
export function AmountInput({
    ref,
    value,
    onChange,
    isMissing,
    autoFocus,
    lastAmount,
}: AmountInputProps) {
    return (
        <Field data-invalid={isMissing}>
            <FieldLabel htmlFor={"amount"}>{m.transaction_amount()}</FieldLabel>
            <CurrencyInputWrapper
                ref={ref}
                id={"amount"}
                name={"amount"}
                // Narrow column: less padding leaves room
                // for four digits and the currency.
                className={"px-3 focus:px-[11px]"}
                inputMode={"decimal"}
                intlConfig={{
                    locale: getLocale(),
                    currency: "EUR",
                }}
                allowNegativeValue={false}
                onValueChange={(newValue) => {
                    onChange(newValue ?? "");
                }}
                decimalsLimit={2}
                value={value}
                step={1}
                autoComplete={"off"}
                autoFocus={autoFocus}
                aria-invalid={isMissing}
                aria-describedby={isMissing ? AMOUNT_ERROR_ID : undefined}
                placeholder={
                    lastAmount !== undefined
                        ? formatCurrency(lastAmount, getLocale())
                        : undefined
                }
            />
        </Field>
    );
}
