import {
    formatCurrency,
    formatLongDate,
    formatPercent,
    type PriceChange,
    type PriceHistoryEntry,
} from "@finances/shared";
import { Badge } from "#/components/ui/badge.tsx";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface PriceHistoryListProps {
    /**
     * Newest first (see `getPriceHistory`).
     */
    entries: PriceHistoryEntry[];
    currency: string;

    /**
     * Opens a price change for editing; the start isn't one.
     */
    onSelect: (change: PriceChange) => void;
}

/**
 * Timeline of a fixed cost's amounts: each with its date and its change
 * against the previous amount, upcoming ones dimmed.
 */
export function PriceHistoryList({
    entries,
    currency,
    onSelect,
}: PriceHistoryListProps) {
    return (
        <ol className={"border-l-2 border-outline-variant pl-4"}>
            {entries.map((entry) => {
                const date = formatLongDate(
                    fromIsoDate(entry.date),
                    getLocale(),
                );
                return (
                    <li key={entry.date} className={"relative py-1"}>
                        <span
                            aria-hidden
                            className={cn(
                                `absolute top-5 -left-[23px] size-3
                                rounded-full`,
                                entry.status === "current"
                                    ? "bg-primary"
                                    : "bg-outline-variant",
                            )}
                        />
                        <button
                            type={"button"}
                            disabled={entry.isStart}
                            onClick={() =>
                                onSelect({
                                    date: entry.date,
                                    amount: entry.amount,
                                })
                            }
                            className={cn(
                                `flex w-full items-center gap-3 rounded-md px-3
                                py-2 text-left`,
                                !entry.isStart && "state-layer focus-ring",
                                entry.status === "upcoming" && "opacity-70",
                            )}
                        >
                            <div className={"flex min-w-0 flex-1 flex-col"}>
                                <span
                                    className={
                                        "text-body-large text-on-surface"
                                    }
                                >
                                    {formatCurrency(
                                        entry.amount,
                                        getLocale(),
                                        currency,
                                    )}
                                    {entry.change !== null && (
                                        <span
                                            className={`ml-2 text-body-small
                                            text-on-surface-variant`}
                                        >
                                            {formatPercent(
                                                entry.change,
                                                getLocale(),
                                                { signed: true },
                                            )}
                                        </span>
                                    )}
                                </span>
                                <span
                                    className={`text-body-medium
                                    text-on-surface-variant`}
                                >
                                    {entry.isStart
                                        ? m.price_history_start({ date })
                                        : m.price_history_from({ date })}
                                </span>
                            </div>
                            {entry.status === "upcoming" && (
                                <Badge variant={"outline"}>
                                    {m.price_history_upcoming()}
                                </Badge>
                            )}
                            {entry.status === "current" && (
                                <Badge variant={"secondary"}>
                                    {m.price_history_current()}
                                </Badge>
                            )}
                        </button>
                    </li>
                );
            })}
        </ol>
    );
}
