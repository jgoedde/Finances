import { isToday } from "date-fns";
import { formatDayHeading, type Transaction } from "@finances/shared";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface TransactionGroupProps {
    day: Date;
    transactions: Transaction[];
}

/**
 * One day of the transaction list, under a sticky header.
 */
export function TransactionGroup({ day, transactions }: TransactionGroupProps) {
    const label = formatDayHeading(day, getLocale());

    return (
        <section className={"flex flex-col pb-2"}>
            {/* Sticks below the search bar (4.5rem). */}
            <h2
                className={cn(
                    `sticky top-18 z-[5] bg-surface px-4 py-2 text-title-small
                    text-on-surface-variant`,
                    isToday(day) && "text-primary",
                )}
            >
                {isToday(day)
                    ? `${m.transaction_list_today()} · ${label}`
                    : label}
            </h2>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                {transactions.map((it) => (
                    <TransactionListItem key={it.id} transaction={it} />
                ))}
            </div>
        </section>
    );
}
