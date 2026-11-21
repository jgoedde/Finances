import type { Transaction } from "@finances/shared";
import { addDays, isSameMonth, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useSelectedMonth } from "#/features/month/month.ts";
import {
    monthTransactionsQuery,
    transactionsQuery,
} from "#/features/transactions/transaction-queries.ts";
import { TransactionGroup } from "#/features/transactions/components/list/transaction-group.tsx";
import { UpcomingTransactions } from "#/features/transactions/components/list/upcoming-transactions.tsx";
import { useMonthLanding } from "#/features/transactions/components/list/month-landing.ts";
import { TransactionListSkeleton } from "#/features/transactions/components/list/transaction-list-skeleton.tsx";
import { TransactionListEmpty } from "#/features/transactions/components/list/transaction-list-empty.tsx";
import { OfflineEmpty } from "#/components/offline-empty.tsx";
import { m } from "#/paraglide/messages.js";
import { groupByDay } from "#/features/transactions/utils/transaction-utils.ts";

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
        monthTransactionsQuery(month),
    );
    const isCurrentMonth = isSameMonth(month, today);
    const upcomingQuery = useQuery({
        ...transactionsQuery({ from: tomorrow, to: Number.MAX_SAFE_INTEGER }),
        enabled: isCurrentMonth,
    });
    const highlighted = useMonthLanding(
        !isPending && (!isCurrentMonth || !upcomingQuery.isPending),
    );

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

    const days = groupByDay(transactions);
    // Unfiltered, so an attached expense finds its main expense even when
    // the category filter hides it.
    const findMainExpense = (id: string) =>
        data?.find((it) => it.id === id) ??
        upcomingQuery.data?.find((it) => it.id === id);

    if (isPending) {
        // A paused query only resumes once the device is back online.
        return fetchStatus === "paused" ? (
            <OfflineEmpty description={m.transaction_list_offline()} />
        ) : (
            <TransactionListSkeleton />
        );
    }
    if (transactions.length === 0 && upcoming.length === 0) {
        return <TransactionListEmpty month={month} category={category} />;
    }
    return (
        <div className={"flex flex-col"}>
            {upcoming.length > 0 && (
                <UpcomingTransactions
                    transactions={upcoming}
                    today={today}
                    highlighted={highlighted}
                    findMainExpense={findMainExpense}
                />
            )}
            {days.map(([day, dayTransactions]) => (
                <TransactionGroup
                    key={day.getTime()}
                    day={day}
                    transactions={dayTransactions}
                    highlighted={highlighted}
                    findMainExpense={findMainExpense}
                />
            ))}
        </div>
    );
}
