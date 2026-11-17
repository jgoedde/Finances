import type { ReactNode } from "react";
import { isSameDay } from "date-fns";
import { formatDayHeading, type Transaction } from "@finances/shared";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";

const today = new Date();

interface TransactionGroupProps {
    day: Date;
    transactions: Transaction[];

    /**
     * The transactions to highlight, e.g. where "Show in month" landed.
     */
    highlighted?: ReadonlySet<string>;

    /**
     * Shown at the end of the header, e.g. a button.
     */
    action?: ReactNode;
}

/**
 * One day of the transaction list, under a sticky header.
 */
export function TransactionGroup({
    day,
    transactions,
    highlighted,
    action,
}: TransactionGroupProps) {
    return (
        <section
            // Lands right under the search bar (4.5rem).
            className={"flex scroll-mt-18 flex-col pb-2"}
            data-landing-anchor={day.getTime()}
        >
            {/* Sticks below the search bar (4.5rem). */}
            <div
                className={cn(
                    "sticky top-18 z-[5] flex items-center bg-surface",
                    action ? "py-0.5 pr-2 pl-4" : "px-4 py-2",
                )}
            >
                <h2
                    className={cn(
                        "grow text-title-small text-on-surface-variant",
                        isSameDay(day, today) && "text-primary",
                    )}
                >
                    {formatDayHeading(day, today, getLocale())}
                </h2>
                {action}
            </div>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                {transactions.map((it) => (
                    <TransactionListItem
                        key={it.id}
                        transaction={it}
                        highlighted={highlighted?.has(it.id)}
                    />
                ))}
            </div>
        </section>
    );
}
