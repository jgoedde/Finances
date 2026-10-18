import { Input } from "#/components/ui/input.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { addMonths, endOfDay, startOfMonth } from "date-fns";
import { type ChangeEvent, type Ref, useMemo } from "react";
import { mergeSimilarKeys, mergeSimilarStrings } from "#/utils/similarity.ts";
import { groupBy, uniq } from "lodash";
import { useRipple } from "#/hooks/use-ripple.ts";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";
import Fuse from "fuse.js";
import type { TransactionKind } from "@finances/shared";
import { m } from "#/paraglide/messages.js";

const now = new Date();

const LABELS = {
    expense: m.transaction_counterparty_expense,
    income: m.transaction_counterparty_income,
} as const satisfies Record<TransactionKind, () => string>;

interface CounterpartyFieldProps {
    ref?: Ref<HTMLInputElement>;
    value: string;
    selectedCategoryId: string | undefined;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onApplySuggestion: (suggestion: string) => void;
    shouldShowSuggestions: boolean;
    kind: TransactionKind;
    error: string | undefined;
}

/**
 * The transaction's counterparty (its `name`): where the money went or
 * where it came from, with suggestions from recent transactions.
 */
export function CounterpartyField({
    ref,
    value,
    selectedCategoryId,
    onInputChange,
    onApplySuggestion,
    shouldShowSuggestions,
    kind,
    error,
}: CounterpartyFieldProps) {
    const queryOptions = useMemo(
        () => ({
            start: startOfMonth(addMonths(now, -3)),
            end: endOfDay(now),
            categoryId: selectedCategoryId,
        }),
        [selectedCategoryId],
    );

    const transactions = useTransactions(queryOptions);

    const fuse = useMemo(() => {
        return new Fuse(transactions, {
            keys: ["name", "description"],
            shouldSort: true,
        });
    }, [transactions]);

    const similarTransactions = useMemo(() => {
        if (value.trim() === "") {
            return [];
        }
        const names = uniq(fuse.search(value).map((e) => e.item.name));
        return mergeSimilarStrings(names, 2).slice(0, 4);
    }, [value, fuse]);

    const topTransactions = useMemo(() => {
        function getTimeOfDayBucket(date: Date) {
            const hour = date.getHours();
            if (hour >= 5 && hour < 11) return "Morgen";
            if (hour >= 11 && hour < 17) return "Mittag";
            if (hour >= 17 && hour < 22) return "Abend";
            return "Nacht";
        }

        const currentTimeBucket = getTimeOfDayBucket(now);
        const currentWeekday = now.getDay();

        // Group by name using mergeSimilarKeys
        const grouped = mergeSimilarKeys(groupBy(transactions, "name"));

        // Score suggestions by frequency, time of day, and weekday
        const scored = Object.entries(grouped).map(([name, arr]) => {
            // arr: Transaction[]
            const freq = arr.length;
            // How many match current time bucket?
            const timeMatches = arr.filter((e) => {
                const d = new Date(e.date);
                return getTimeOfDayBucket(d) === currentTimeBucket;
            }).length;
            // How many match current weekday?
            const weekdayMatches = arr.filter((e) => {
                const d = new Date(e.date);
                return d.getDay() === currentWeekday;
            }).length;
            // Score: freq + timeMatches*2 + weekdayMatches*2
            const score = freq + timeMatches * 2 + weekdayMatches * 2;
            return { name, freq, score };
        });
        // Sort by score, then freq
        scored.sort((a, b) => b.score - a.score || b.freq - a.freq);

        return scored.slice(0, 4).map((s) => s.name);
    }, [transactions]);

    const ripple = useRipple();

    const suggestions = useMemo(() => {
        if (value.trim() === "") {
            return topTransactions;
        } else {
            return similarTransactions;
        }
    }, [value, similarTransactions, topTransactions]);

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
            {suggestions.length > 0 && shouldShowSuggestions && (
                <div className={"flex flex-wrap gap-2"}>
                    {suggestions.map((e) => (
                        <button
                            key={`suggestion-${e}`}
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

                                onApplySuggestion(e);
                            }}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            )}
        </Field>
    );
}
