import { type ChangeEvent, type Ref, useMemo } from "react";
import { SparklesIcon } from "lucide-react";
import Fuse from "fuse.js";
import {
    type Counterparty,
    counterpartyKey,
    rankCounterparties,
    type TransactionKind,
} from "@finances/shared";
import { Input } from "#/components/ui/input.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { useRipple } from "#/hooks/use-ripple.ts";
import { m } from "#/paraglide/messages.js";

const now = new Date();

const SUGGESTION_COUNT = 5;

const LABELS = {
    expense: m.transaction_counterparty_expense,
    income: m.transaction_counterparty_income,
} as const satisfies Record<TransactionKind, () => string>;

interface CounterpartyFieldProps {
    ref?: Ref<HTMLInputElement>;
    value: string;
    counterparties: Counterparty[];
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * A suggested counterparty was tapped.
     */
    onPick: (name: string) => void;
    shouldShowSuggestions: boolean;
    kind: TransactionKind;
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
 * The transaction's counterparty: where the money went or
 * where it came from, with suggestions from recent transactions.
 */
export function CounterpartyField({
    ref,
    value,
    counterparties,
    onInputChange,
    onPick,
    shouldShowSuggestions,
    kind,
    error,
    match,
    onAcceptMatch,
    aliasedFrom,
    onUndoAlias,
}: CounterpartyFieldProps) {
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

    const ripple = useRipple();

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
                aria-describedby={
                    error !== undefined ? "transaction-error" : undefined
                }
            />
            {error !== undefined && (
                <p
                    id={"transaction-error"}
                    className={"px-4 text-body-small text-error"}
                >
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
                        <Badge asChild variant={"md3"}>
                            <button
                                type={"button"}
                                aria-label={m.transaction_counterparty_use({
                                    name: match.name,
                                })}
                                className={`border-transparent
                                bg-secondary-container
                                text-on-secondary-container`}
                                onClick={onAcceptMatch}
                            >
                                <SparklesIcon aria-hidden />
                                {`${match.name}?`}
                            </button>
                        </Badge>
                    )}
                    {shouldShowSuggestions &&
                        suggestions.map((suggestion) => (
                            <button
                                key={suggestion.name}
                                tabIndex={-1}
                                aria-hidden="true"
                                className={`ripple-container state-layer h-8
                                cursor-pointer rounded-sm border
                                border-outline-variant px-4 text-label-large
                                text-on-surface-variant`}
                                data-ripple-color={"bg-on-surface/50"}
                                {...ripple}
                                type={"button"}
                                onClick={(event) => {
                                    ripple.onClick(event);

                                    onPick(suggestion.name);
                                }}
                            >
                                {suggestion.name}
                            </button>
                        ))}
                </div>
            )}
        </Field>
    );
}
