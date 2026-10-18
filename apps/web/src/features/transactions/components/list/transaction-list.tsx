import { endOfMonth } from "date-fns";
import { groupBy } from "lodash";
import type { Transaction } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import { useSelectedMonth } from "#/features/month/month.ts";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

/** The transactions of the selected month, grouped by day. */
export function TransactionList() {
    const month = useSelectedMonth();
    const transactions = useTransactions({
        start: month,
        end: endOfMonth(month),
    });

    const grouped: Record<string, Transaction[]> = groupBy(transactions, (e) =>
        new Date(e.date).toLocaleDateString(getLocale(), {
            weekday: "short",
            day: "2-digit",
            month: "long",
        }),
    );

    return (
        <Card className={"m-2 gap-0 px-2 py-4"}>
            {transactions.length === 0 && (
                <div
                    className={`mt-2 text-center text-body-medium
                    text-on-surface-variant`}
                >
                    {m.transaction_list_empty({
                        period: month.toLocaleDateString(getLocale(), {
                            month: "long",
                            year: "numeric",
                        }),
                    })}
                </div>
            )}
            {Object.keys(grouped).map((day) => (
                <TransactionGroup
                    key={day}
                    day={day}
                    transactions={grouped[day] ?? []}
                />
            ))}
        </Card>
    );
}

function TransactionGroup({
    day,
    transactions,
}: {
    day: string;
    transactions: Transaction[];
}) {
    return (
        <div className={"mb-3 flex flex-col py-1"}>
            <div
                className={"mb-1 px-2 text-title-small text-on-surface-variant"}
            >
                {day}
            </div>
            <div className={"flex flex-col gap-y-1.5"}>
                {transactions.map((it) => (
                    <TransactionListItem key={it.id} transaction={it} />
                ))}
            </div>
        </div>
    );
}
