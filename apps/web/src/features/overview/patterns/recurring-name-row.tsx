import { Repeat2 } from "lucide-react";
import { formatCurrency, type Pattern } from "@finances/shared";
import { PatternRowLayout } from "#/features/overview/patterns/pattern-row-layout.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface RecurringNameRowProps {
    pattern: Extract<Pattern, { kind: "recurringName" }>;
}

/**
 * "Lidl: 14× in 3 months, ⌀ 9 €", opening a search for the name.
 */
export function RecurringNameRow({ pattern }: RecurringNameRowProps) {
    return (
        <PatternRowLayout icon={<Repeat2 />} search={{ q: pattern.name }}>
            {m.pattern_recurring({
                name: pattern.name,
                count: pattern.count,
                average: formatCurrency(pattern.average, getLocale()),
            })}
        </PatternRowLayout>
    );
}
