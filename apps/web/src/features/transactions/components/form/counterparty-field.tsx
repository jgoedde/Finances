import { type ChangeEvent, type Ref, useMemo } from "react";
import SparklesIcon from "~icons/material-symbols/auto-awesome-outline-rounded";
import Fuse from "fuse.js";
import {
    type Counterparty,
    counterpartyKey,
    rankCounterparties,
    type TransactionKind,
} from "@finances/shared";
import { Input } from "#/components/ui/input.tsx";
import { Button } from "#/components/ui/button.tsx";
import { SuggestionChip } from "#/components/ui/chip.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { m } from "#/paraglide/messages.js";

const now = new Date();

const SUGGESTION_COUNT = 5;

const ERROR_ID = "transaction-error";

const LABELS = {
    expense: m.transaction_counterparty_expense,
    income: m.transaction_counterparty_income,
} as const satisfies Record<TransactionKind, () => string>;

interface CounterpartyInputProps {
    ref?: Ref<HTMLInputElement>;
    value: string;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    kind: TransactionKind;
    error: string | undefined;
}

/**
 * The transaction's counterparty: where the money went or
 * where it came from. Its hints render separately in
 * {@link CounterpartyHints}, so the input can share a row.
 */
export function CounterpartyInput({
    ref,
    value,
    onInputChange,
    kind,
    error,
}: CounterpartyInputProps) {
    return (
        <Field data-invalid={error !== undefined}>
            <FieldLabel htmlFor={"transaction"}>{LABELS[kind]()}</FieldLabel>
            <Input
                ref={ref}
                id={"transaction"}
                name={"transaction"}
                value={value}
                onChange={onInputChange}
                type={"text"}
                autoComplete={"off"}
                aria-invalid={error !== undefined}
                aria-describedby={error !== undefined ? ERROR_ID : undefined}
            />
        </Field>
    );
}

interface CounterpartyHintsProps {
    value: string;
    counterparties: Counterparty[];

    /**
     * A suggested counterparty was tapped.
     */
    onPick: (name: string) => void;
    shouldShowSuggestions: boolean;
    error: string | undefined;

    /**
     * The known counterparty the raw value most likely stands for.
     */
    match: Counterparty | undefined;
    onAcceptMatch: VoidFunction;

    /**
     * The raw value a learned alias replaced.
     */
    aliasedFrom: string | undefined;
    onUndoAlias: VoidFunction;
}

/**
 * What goes under the {@link CounterpartyInput}: its error, the undo for a
 * learned alias and suggestions from recent transactions.
 */
export function CounterpartyHints({
    value,
    counterparties,
    onPick,
    shouldShowSuggestions,
    error,
    match,
    onAcceptMatch,
    aliasedFrom,
    onUndoAlias,
}: CounterpartyHintsProps) {
    const fuse = useMemo(
        () => new Fuse(counterparties, { keys: ["name"] }),
        [counterparties],
    );

    const suggestions = useMemo(() => {
        if (value.trim() === "") {
            return rankCounterparties(counterparties, now, SUGGESTION_COUNT);
        }
        const key = counterpartyKey(value);
        return fuse
            .search(value)
            .map((result) => result.item)
            .filter((it) => counterpartyKey(it.name) !== key && it !== match)
            .slice(0, SUGGESTION_COUNT);
    }, [value, counterparties, fuse, match]);

    return (
        <>
            {error !== undefined && (
                <p id={ERROR_ID} className={"px-4 text-body-small text-error"}>
                    {error}
                </p>
            )}
            {aliasedFrom !== undefined && (
                <div
                    className={`-my-2 flex items-center gap-1 pl-4
                    text-body-small text-on-surface-variant`}
                >
                    <span className={"min-w-0 truncate"}>
                        {m.transaction_counterparty_aliased({
                            raw: aliasedFrom,
                        })}
                    </span>
                    <Button
                        type={"button"}
                        variant={"text"}
                        size={"sm"}
                        onClick={onUndoAlias}
                    >
                        {m.action_undo()}
                    </Button>
                </div>
            )}
            {(match !== undefined ||
                (shouldShowSuggestions && suggestions.length > 0)) && (
                <div className={"flex flex-wrap gap-2"}>
                    {match !== undefined && (
                        <SuggestionChip
                            aria-label={m.transaction_counterparty_use({
                                name: match.name,
                            })}
                            icon={SparklesIcon}
                            className={`border-transparent
                            bg-secondary-container text-on-secondary-container
                            [&_svg]:text-on-secondary-container`}
                            onClick={onAcceptMatch}
                        >
                            {`${match.name}?`}
                        </SuggestionChip>
                    )}
                    {shouldShowSuggestions &&
                        suggestions.map((suggestion) => (
                            <SuggestionChip
                                key={suggestion.name}
                                tabIndex={-1}
                                aria-hidden="true"
                                onClick={() => onPick(suggestion.name)}
                            >
                                {suggestion.name}
                            </SuggestionChip>
                        ))}
                </div>
            )}
        </>
    );
}
