import type { KeyboardEvent } from "react";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface AmountStepProps {
    value: string;
    onChange: (amountStr: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function AmountStep({ value, onChange, onKeyDown }: AmountStepProps) {
    return (
        <Field>
            <FieldLabel htmlFor={"amount"}>
                {m.fixed_cost_amount_eur()}
            </FieldLabel>
            <CurrencyInputWrapper
                id={"amount"}
                inputMode={"decimal"}
                intlConfig={{
                    locale: getLocale(),
                    currency: "EUR",
                }}
                required
                allowNegativeValue={false}
                onValueChange={(e) => onChange(e ?? "")}
                decimalsLimit={2}
                value={value}
                step={0.01}
                autoFocus
                autoComplete={"off"}
                enterKeyHint={"next"}
                onKeyDown={onKeyDown}
            />
        </Field>
    );
}
