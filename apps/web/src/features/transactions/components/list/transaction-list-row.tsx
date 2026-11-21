import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import {
    type ListRow,
    occasionTotal,
} from "#/features/transactions/utils/list-rows.ts";
import { m } from "#/paraglide/messages.js";

interface TransactionListRowProps {
    row: ListRow;

    /**
     * The transactions to highlight, e.g. where "Show in month" landed.
     */
    highlighted?: ReadonlySet<string>;

    /**
     * Shown before the supporting text, e.g. when an upcoming transaction is
     * due.
     */
    dateLabel?: string;
}

/**
 * A transaction's row; a main expense's attached expenses follow as compact,
 * indented rows on a line.
 */
export function TransactionListRow({
    row,
    highlighted,
    dateLabel,
}: TransactionListRowProps) {
    const { transaction, attached, mainExpense } = row;

    return (
        <div className={"flex flex-col"}>
            <TransactionListItem
                transaction={transaction}
                highlighted={highlighted?.has(transaction.id)}
                dateLabel={dateLabel}
                total={attached.length > 0 ? occasionTotal(row) : undefined}
                mainExpense={mainExpense}
            />
            {attached.length > 0 && (
                <div
                    role={"group"}
                    aria-label={m.transaction_attached_expenses({
                        counterparty: transaction.counterparty,
                    })}
                    // The line runs below the center of the main avatar.
                    className={`ml-7 flex flex-col border-l-2
                    border-outline-variant pl-3`}
                >
                    {attached.map((it) => (
                        <TransactionListItem
                            key={it.id}
                            transaction={it}
                            highlighted={highlighted?.has(it.id)}
                            compact
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
