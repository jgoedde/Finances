import type { RefObject } from "react";
import type { TransactionKind } from "@finances/shared";
import {
    CounterpartyHints,
    CounterpartyInput,
} from "#/features/transactions/components/form/counterparty-field.tsx";
import { AmountInput } from "#/features/transactions/components/form/amount-input.tsx";
import { AmountHints } from "#/features/transactions/components/form/amount-hints.tsx";
import type { useCounterpartyEntry } from "#/features/transactions/components/form/use-counterparty-entry.ts";

interface AmountCounterpartyFieldsProps {
    amountInputRef: RefObject<HTMLInputElement | null>;
    counterpartyInputRef: RefObject<HTMLInputElement | null>;
    amountStr: string;
    onAmountChange: (amountStr: string) => void;
    isAmountMissing: boolean;
    autoFocusAmount: boolean;
    entry: ReturnType<typeof useCounterpartyEntry>;
    kind: TransactionKind;
    counterpartyError: string | undefined;
}

/**
 * Amount and counterparty share a row to save height; their hints go below
 * it at full width.
 */
export function AmountCounterpartyFields({
    amountInputRef,
    counterpartyInputRef,
    amountStr,
    onAmountChange,
    isAmountMissing,
    autoFocusAmount,
    entry,
    kind,
    counterpartyError,
}: AmountCounterpartyFieldsProps) {
    const lastAmount = amountStr === "" ? entry.known?.lastAmount : undefined;

    return (
        <div className={"flex flex-col gap-3"}>
            <div
                className={"grid grid-cols-[minmax(0,3fr)_minmax(0,7fr)] gap-3"}
            >
                <AmountInput
                    ref={amountInputRef}
                    value={amountStr}
                    onChange={onAmountChange}
                    isMissing={isAmountMissing}
                    autoFocus={autoFocusAmount}
                    lastAmount={lastAmount}
                />

                <CounterpartyInput
                    ref={counterpartyInputRef}
                    value={entry.counterparty}
                    onInputChange={(e) => entry.type(e.target.value)}
                    kind={kind}
                    error={counterpartyError}
                />
            </div>

            <AmountHints
                isMissing={isAmountMissing}
                lastAmount={lastAmount}
                onUseLastAmount={(amount) => onAmountChange(amount.toFixed(2))}
            />

            <CounterpartyHints
                shouldShowSuggestions={entry.shouldShowSuggestions}
                value={entry.counterparty}
                counterparties={entry.counterparties}
                onPick={entry.pick}
                match={entry.match}
                onAcceptMatch={entry.acceptMatch}
                aliasedFrom={entry.aliasedFrom}
                onUndoAlias={entry.undoAlias}
                error={counterpartyError}
            />
        </div>
    );
}
