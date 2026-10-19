import { formatMonthYear, type Transaction } from "@finances/shared";
import { addDays, endOfMonth, isSameMonth, startOfDay } from "date-fns";
import { groupBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useSelectedMonth } from "#/features/month/month.ts";
import { transactionsQuery } from "#/features/transactions/transaction-queries.ts";
import { TransactionGroup } from "#/features/transactions/components/list/transaction-group.tsx";
import { UpcomingTransactions } from "#/features/transactions/components/list/upcoming-transactions.tsx";
import { TransactionListSkeleton } from "#/features/transactions/components/list/transaction-list-skeleton.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

const today = new Date();
const tomorrow = startOfDay(addDays(today, 1)).getTime();

/**
 * The transactions of the selected month (and category, if one is
 * selected), grouped by day under sticky headers. The current month starts
 * with all upcoming transactions, also those of later months.
 */
export function TransactionList() {
    const month = useSelectedMonth();
    const { category } = transactionsRoute.useSearch();
    // The whole month, so the category filter shares the cached list.
    const { data, isPending, fetchStatus } = useQuery(
        transactionsQuery({
            from: month.getTime(),
            to: endOfMonth(month).getTime(),
        }),
    );
    const isCurrentMonth = isSameMonth(month, today);
    const upcomingQuery = useQuery({
        ...transactionsQuery({ from: tomorrow, to: Number.MAX_SAFE_INTEGER }),
        enabled: isCurrentMonth,
    });

    const matchesCategory = (it: Transaction) =>
        !category || it.categoryId === category;
    const transactions = (data ?? []).filter(
        (it) => it.date < tomorrow && matchesCategory(it),
    );
    const upcoming = isCurrentMonth
        ? (upcomingQuery.data ?? [])
              .filter(matchesCategory)
              .sort((a, b) => a.date - b.date)
        : [];

    const days = Object.entries(
        groupBy(transactions, (it) => startOfDay(it.date).getTime()),
    ).sort(([a], [b]) => Number(b) - Number(a));

    if (isPending) {
        // A paused query only resumes once the device is back online.
        return fetchStatus === "paused" ? (
            <p
                className={`my-8 text-center text-body-medium
                    text-on-surface-variant`}
            >
                {m.transaction_list_offline()}
            </p>
        ) : (
            <TransactionListSkeleton />
        );
    }
    if (transactions.length === 0 && upcoming.length === 0) {
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
            {upcoming.length > 0 && (
                <UpcomingTransactions transactions={upcoming} today={today} />
            )}
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
