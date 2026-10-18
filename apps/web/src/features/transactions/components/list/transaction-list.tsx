import { formatMonthYear } from "@finances/shared";
import { endOfMonth, startOfDay } from "date-fns";
import { groupBy } from "lodash";
import { getRouteApi } from "@tanstack/react-router";
import { useSelectedMonth } from "#/features/month/month.ts";
import { useTransactions } from "#/features/transactions/transaction-queries.ts";
import { TransactionGroup } from "#/features/transactions/components/list/transaction-group.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * The transactions of the selected month (and category, if one is
 * selected), grouped by day under sticky headers.
 */
export function TransactionList() {
    const month = useSelectedMonth();
    const { category } = transactionsRoute.useSearch();
    // The whole month, so the category filter shares the cached list.
    const transactions = useTransactions({
        start: month,
        end: endOfMonth(month),
    }).filter((it) => !category || it.categoryId === category);

    const days = Object.entries(
        groupBy(transactions, (it) => startOfDay(it.date).getTime()),
    ).sort(([a], [b]) => Number(b) - Number(a));

    if (transactions.length === 0) {
        return (
            <p
                className={`my-8 text-center text-body-medium
                    text-on-surface-variant`}
            >
                {m.transaction_list_empty({
                    period: formatMonthYear(month, getLocale()),
                })}
            </p>
        );
    }
    return (
        <div className={"flex flex-col"}>
            {days.map(([day, dayTransactions]) => (
                <TransactionGroup
                    key={day}
                    day={new Date(Number(day))}
                    transactions={dayTransactions}
                />
            ))}
        </div>
    );
}
