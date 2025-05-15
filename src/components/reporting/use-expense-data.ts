import { useMemo } from "react";
import { isSameMonth } from "date-fns";
import { useAppSelector } from "@/hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";

type UseExpenseDataArgs = {
    month: { year: number; monthIndex: number };
};

export function useExpenseData({ month }: UseExpenseDataArgs): ExpenseData {
    const expenses = useAppSelector(expensesSelectors.selectAll);

    const categories = useMemo(() => {
        const categories = new Set<string>();

        expenses
            .filter((expense) =>
                isSameMonth(
                    new Date(month.year, month.monthIndex, 1),
                    new Date(expense.date),
                ),
            )
            .forEach((expense) => {
                if (expense.category) {
                    categories.add(expense.category.name);
                }
            });
        return Array.from(categories);
    }, [expenses, month.monthIndex, month.year]);

    const chartData: ChartData = useMemo(
        () =>
            categories.map((category) => {
                const total = expenses
                    .filter((expense) => expense.category?.name === category)
                    .filter((expense) =>
                        isSameMonth(
                            new Date(month.year, month.monthIndex, 1),
                            new Date(expense.date),
                        ),
                    )
                    .reduce((acc, expense) => acc + expense.amount, 0);

                return {
                    category: category,
                    spent: total,
                };
            }),
        [categories, expenses, month.monthIndex, month.year],
    );

    const totalSpent = useMemo(() => {
        return chartData.reduce((acc, chart) => {
            return acc + chart.spent;
        }, 0);
    }, [chartData]);

    const expensesCount = useMemo(() => {
        return expenses.filter((expense) =>
            isSameMonth(
                new Date(month.year, month.monthIndex, 1),
                new Date(expense.date),
            ),
        ).length;
    }, [expenses, month.monthIndex, month.year]);

    return {
        chartData,
        totalSpent,
        expensesCount,
    };
}

type ExpenseData = {
    chartData: ChartData;
    totalSpent: number;
    expensesCount: number;
};

export type ChartData = { category: string; spent: number }[];
