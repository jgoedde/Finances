import { useState } from "react";
import { findCounterparty, matchCounterparty } from "@finances/shared";
import { useCounterparties } from "#/features/transactions/use-counterparties.ts";
import { counterpartyAliases } from "#/features/transactions/counterparty-aliases.ts";

interface CounterpartyEntryOptions {
    /**
     * The counterparty as it came in, e.g. "ALDI NORD 1234 HAMBURG" from a
     * link.
     */
    rawCounterparty: string;

    /**
     * Suggest counterparties, match and replace raw ones, and look up the
     * known counterparty for predictions.
     */
    predict: boolean;

    /**
     * The user typed or picked a counterparty.
     */
    onEdit: VoidFunction;
}

/**
 * The counterparty field's state: what was entered, the suggestions, the
 * known counterparty it matches and the learned aliases for raw values.
 */
export function useCounterpartyEntry({
    rawCounterparty,
    predict,
    onEdit,
}: CounterpartyEntryOptions) {
    const counterparties = useCounterparties();

    const [learnedCounterparty] = useState(() =>
        predict && rawCounterparty.trim() !== ""
            ? counterpartyAliases.get(rawCounterparty)
            : undefined,
    );
    const [aliasedFrom, setAliasedFrom] = useState(
        learnedCounterparty !== undefined ? rawCounterparty : undefined,
    );
    const [isMatchDismissed, setIsMatchDismissed] = useState(false);
    const initialCounterparty = learnedCounterparty ?? rawCounterparty;
    const [counterparty, setCounterparty] = useState(initialCounterparty);
    const [shouldShowSuggestions, setShouldShowSuggestions] = useState(predict);

    const known = predict
        ? findCounterparty(counterparties, counterparty)
        : undefined;
    const match =
        predict &&
        !isMatchDismissed &&
        aliasedFrom === undefined &&
        counterparty === rawCounterparty &&
        rawCounterparty.trim() !== ""
            ? matchCounterparty(counterparties, rawCounterparty)
            : undefined;

    function type(value: string) {
        setCounterparty(value);
        onEdit();
        setAliasedFrom(undefined);

        setShouldShowSuggestions(true);
    }

    function pick(picked: string) {
        setCounterparty(picked);
        onEdit();
        setShouldShowSuggestions(false);
    }

    function acceptMatch() {
        if (!match) {
            return;
        }
        pick(match.name);
        counterpartyAliases.set(rawCounterparty, match.name);
        setAliasedFrom(rawCounterparty);
    }

    function undoAlias() {
        setCounterparty(rawCounterparty);
        counterpartyAliases.remove(rawCounterparty);
        setAliasedFrom(undefined);
        setIsMatchDismissed(true);
    }

    return {
        counterparty,
        initialCounterparty,
        counterparties,
        known,
        match,
        aliasedFrom,
        shouldShowSuggestions,
        type,
        pick,
        acceptMatch,
        undoAlias,
    };
}
