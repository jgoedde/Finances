import { formatUpcomingDay, type Transaction } from "@finances/shared";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface UpcomingTransactionsProps {
    /**
     * Ascending, the next one first.
     */
    transactions: Transaction[];
    today: Date;

    /**
     * The transactions to highlight, e.g. where "Show in month" landed.
     */
    highlighted?: ReadonlySet<string>;
}

/**
 * Upcoming transactions above the days of the current month, under one
 * sticky header; each row says when it's due.
 */
export function UpcomingTransactions({
    transactions,
    today,
    highlighted,
}: UpcomingTransactionsProps) {
    return (
        <section
            // Lands right under the search bar (4.5rem).
            className={"flex scroll-mt-18 flex-col pb-2"}
            data-landing-anchor={"upcoming"}
        >
            {/* Sticks below the search bar (4.5rem), like the day headers. */}
            <h2
                className={`sticky top-18 z-[5] bg-surface px-4 py-2
                    text-title-small text-on-surface-variant`}
            >
                {m.transaction_list_upcoming()}
            </h2>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                {transactions.map((it) => (
                    <TransactionListItem
                        key={it.id}
                        transaction={it}
                        highlighted={highlighted?.has(it.id)}
                        dateLabel={formatUpcomingDay(
                            new Date(it.date),
                            today,
                            getLocale(),
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
