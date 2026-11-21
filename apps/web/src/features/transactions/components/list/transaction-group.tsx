import type { ReactNode } from "react";
import { isSameDay } from "date-fns";
import { formatDayHeading, type Transaction } from "@finances/shared";
import { TransactionListRow } from "#/features/transactions/components/list/transaction-list-row.tsx";
import { toListRows } from "#/features/transactions/utils/list-rows.ts";
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
     * Looks up the main expense of an attached expense whose main expense is
     * not among `transactions`, for the "belongs to" hint.
     */
    findMainExpense?: (id: string) => Transaction | undefined;

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
    findMainExpense,
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
                {toListRows(transactions, findMainExpense).map((row) => (
                    <TransactionListRow
                        key={row.transaction.id}
                        row={row}
                        highlighted={highlighted}
                    />
                ))}
            </div>
        </section>
    );
}
