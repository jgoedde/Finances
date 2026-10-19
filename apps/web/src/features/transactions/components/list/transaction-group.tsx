import { isSameDay } from "date-fns";
import { formatDayHeading, type Transaction } from "@finances/shared";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";

// Set when the module loads; headings don't roll over at midnight.
const today = new Date();

interface TransactionGroupProps {
    day: Date;
    transactions: Transaction[];
}

/**
 * One day of the transaction list, under a sticky header.
 */
export function TransactionGroup({ day, transactions }: TransactionGroupProps) {
    return (
        <section className={"flex flex-col pb-2"}>
            {/* Sticks below the search bar (4.5rem). */}
            <h2
                className={cn(
                    `sticky top-18 z-[5] bg-surface px-4 py-2 text-title-small
                    text-on-surface-variant`,
                    isSameDay(day, today) && "text-primary",
                )}
            >
                {formatDayHeading(day, today, getLocale())}
            </h2>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                {transactions.map((it) => (
                    <TransactionListItem key={it.id} transaction={it} />
                ))}
            </div>
        </section>
    );
}
