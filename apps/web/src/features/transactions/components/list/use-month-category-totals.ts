import { getRouteApi } from "@tanstack/react-router";
import { endOfMonth } from "date-fns";
import { type Category, netSpending } from "@finances/shared";
import { useSelectedMonth } from "#/features/month/month.ts";
import {
    useCategories,
    useTransactions,
} from "#/features/transactions/transaction-queries.ts";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/**
 * Net spending per category in the selected month, largest first. Only
 * categories with transactions, plus the selected one.
 */
export function useMonthCategoryTotals(): {
    category: Category;
    total: number;
}[] {
    const month = useSelectedMonth();
    const { category: selected } = transactionsRoute.useSearch();
    const transactions = useTransactions({
        start: month,
        end: endOfMonth(month),
    });
    const categories = useCategories();

    const totals = new Map<string, number>();
    for (const transaction of transactions) {
        totals.set(
            transaction.categoryId,
            (totals.get(transaction.categoryId) ?? 0) +
                netSpending(transaction),
        );
    }
    return categories
        .filter(({ id }) => totals.has(id) || id === selected)
        .map((category) => ({ category, total: totals.get(category.id) ?? 0 }))
        .sort((a, b) => b.total - a.total);
}
