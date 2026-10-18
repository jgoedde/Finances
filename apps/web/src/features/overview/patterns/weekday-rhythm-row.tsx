import { CalendarDays } from "lucide-react";
import { formatPercent, formatWeekday, type Pattern } from "@finances/shared";
import { PatternRowLayout } from "#/features/overview/patterns/pattern-row-layout.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface WeekdayRhythmRowProps {
    pattern: Extract<Pattern, { kind: "weekdayRhythm" }>;
}

/**
 * "60 % of Restaurants spending falls on Fri–Sat", opening the category.
 */
export function WeekdayRhythmRow({ pattern }: WeekdayRhythmRowProps) {
    const locale = getLocale();

    return (
        <PatternRowLayout
            icon={<CalendarDays />}
            search={{ category: pattern.category.categoryId }}
        >
            {m.pattern_rhythm({
                share: formatPercent(pattern.share, locale),
                category: pattern.category.categoryName,
                first: formatWeekday(pattern.firstWeekday, locale),
                last: formatWeekday(pattern.lastWeekday, locale),
            })}
        </PatternRowLayout>
    );
}
