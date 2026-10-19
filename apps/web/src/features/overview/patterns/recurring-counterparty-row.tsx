import { Repeat2 } from "lucide-react";
import { formatCurrency, type Pattern } from "@finances/shared";
import { PatternRowLayout } from "#/features/overview/patterns/pattern-row-layout.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface RecurringCounterpartyRowProps {
    pattern: Extract<Pattern, { kind: "recurringCounterparty" }>;
}

/**
 * "Lidl: 14× in 3 months, ⌀ 9 €", opening a search for the counterparty.
 */
export function RecurringCounterpartyRow({
    pattern,
}: RecurringCounterpartyRowProps) {
    return (
        <PatternRowLayout
            icon={<Repeat2 />}
            search={{ q: pattern.counterparty }}
        >
            {m.pattern_recurring({
                name: pattern.counterparty,
                count: pattern.count,
                average: formatCurrency(pattern.average, getLocale()),
            })}
        </PatternRowLayout>
    );
}
