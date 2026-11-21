import { FilterChip } from "#/components/ui/chip.tsx";
import { m } from "#/paraglide/messages.js";

/**
 * How many months each range of the history graph shows, today's included.
 */
export const HISTORY_RANGES = {
    "1y": { label: m.fixed_cost_history_range_1y, months: 12 },
    "3y": { label: m.fixed_cost_history_range_3y, months: 36 },
    all: { label: m.fixed_cost_history_range_all, months: Infinity },
} as const satisfies Record<string, { label: () => string; months: number }>;

export type HistoryRange = keyof typeof HISTORY_RANGES;

interface HistoryRangeChipsProps {
    range: HistoryRange;
    onChange: (range: HistoryRange) => void;

    /**
     * The range's first month, shown on the left.
     */
    firstMonthLabel: string;
}

/**
 * The row under the history graph: the range's first month, then pill
 * chips to pick the range.
 */
export function HistoryRangeChips({
    range,
    onChange,
    firstMonthLabel,
}: HistoryRangeChipsProps) {
    return (
        <div
            className={`flex items-center gap-1 px-5 py-1 text-label-small
                text-on-surface-variant`}
        >
            <span className={"grow"}>{firstMonthLabel}</span>
            {Object.entries(HISTORY_RANGES).map(([key, it]) => (
                <FilterChip
                    key={key}
                    selected={range === key}
                    className={`h-auto rounded-full border-transparent px-3 py-1
                        text-label-medium aria-pressed:bg-tertiary-container
                        aria-pressed:text-on-tertiary-container
                        aria-pressed:[&_svg]:text-on-tertiary-container`}
                    onSelect={() => onChange(key as HistoryRange)}
                >
                    {it.label()}
                </FilterChip>
            ))}
        </div>
    );
}
