import type { Pattern } from "@finances/shared";
import { CategoryDriftRow } from "#/features/overview/patterns/category-drift-row.tsx";
import { RecurringNameRow } from "#/features/overview/patterns/recurring-name-row.tsx";
import { SmallPurchasesRow } from "#/features/overview/patterns/small-purchases-row.tsx";
import { WeekdayRhythmRow } from "#/features/overview/patterns/weekday-rhythm-row.tsx";

interface PatternRowProps {
    pattern: Pattern;
}

/**
 * Renders a pattern with the row component of its kind.
 */
export function PatternRow({ pattern }: PatternRowProps) {
    switch (pattern.kind) {
        case "categoryDrift":
            return <CategoryDriftRow pattern={pattern} />;
        case "weekdayRhythm":
            return <WeekdayRhythmRow pattern={pattern} />;
        case "recurringName":
            return <RecurringNameRow pattern={pattern} />;
        case "smallPurchases":
            return <SmallPurchasesRow pattern={pattern} />;
        default:
            throw new Error(
                `unreachable error - type ${String(pattern satisfies never)}`,
            );
    }
}
