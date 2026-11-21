import { formatUpcomingDay, type Transaction } from "@finances/shared";
import { TransactionListRow } from "#/features/transactions/components/list/transaction-list-row.tsx";
import { toListRows } from "#/features/transactions/utils/list-rows.ts";
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

    /**
     * Looks up the main expense of an attached expense whose main expense is
     * not among `transactions`, for the "belongs to" hint.
     */
    findMainExpense: (id: string) => Transaction | undefined;
}

/**
 * Upcoming transactions above the days of the current month, under one
 * sticky header; each row says when it's due.
 */
export function UpcomingTransactions({
    transactions,
    today,
    highlighted,
    findMainExpense,
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
                {toListRows(transactions, findMainExpense).map((row) => (
                    <TransactionListRow
                        key={row.transaction.id}
                        row={row}
                        highlighted={highlighted}
                        dateLabel={formatUpcomingDay(
                            new Date(row.transaction.date),
                            today,
                            getLocale(),
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
