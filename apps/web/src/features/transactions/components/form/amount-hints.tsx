import { formatCurrency } from "@finances/shared";
import { SuggestionChip } from "#/components/ui/chip.tsx";
import { AMOUNT_ERROR_ID } from "#/features/transactions/components/form/transaction-form-model.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface AmountHintsProps {
    isMissing: boolean;

    /**
     * The counterparty's last amount, offered as a chip.
     */
    lastAmount: number | undefined;
    onUseLastAmount: (amount: number) => void;
}

/**
 * What goes under the {@link AmountInput}: its error and the last amount.
 */
export function AmountHints({
    isMissing,
    lastAmount,
    onUseLastAmount,
}: AmountHintsProps) {
    return (
        <>
            {isMissing && (
                <p
                    id={AMOUNT_ERROR_ID}
                    className={"px-4 text-body-small text-error"}
                >
                    {m.transaction_amount_missing()}
                </p>
            )}
            {lastAmount !== undefined && (
                <SuggestionChip
                    onClick={() => {
                        onUseLastAmount(lastAmount);
                    }}
                >
                    {m.transaction_amount_last({
                        amount: formatCurrency(lastAmount, getLocale()),
                    })}
                </SuggestionChip>
            )}
        </>
    );
}
