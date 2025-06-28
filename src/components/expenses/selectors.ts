import { expensesAdapter } from "@/components/expenses/slice.ts";
import {
    getMonth,
    getWeek,
    getYear,
    isSameMonth,
    isToday,
    isYesterday,
    subMonths,
} from "date-fns";
import type { RootState } from "@/store.ts";

export const selectSpentToday = (state: RootState) => {
    const amountsToday = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isToday(e.date))
        .map((e) => e.amount);

    return amountsToday.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentThisMonth = (state: RootState) => {
    const amountsThisMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isSameMonth(new Date(), e.date))
        .map((e) => e.amount);

    return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentYesterday = (state: RootState) => {
    const amountsYesterday = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isYesterday(e.date))
        .map((e) => e.amount);

    return amountsYesterday.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentThisMonthInCategory = (
    state: RootState,
    categoryName: string,
) => {
    const amountsThisMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter(
            (e) =>
                isSameMonth(new Date(e.date), new Date()) &&
                e.category.name === categoryName,
        )
        .map((e) => e.amount);

    return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentInMonth = (state: RootState, month: Date): number => {
    const amountsInMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isSameMonth(new Date(e.date), month))
        .map((e) => e.amount);

    return amountsInMonth.reduce((acc, amount) => acc + amount, 0);
};

export const selectPastMonthsExpenses = (
    state: RootState,
    months: number,
): {
    year: number;
    month: number;
    weeks: {
        calendarWeek: number;
        spent: number;
    }[];
}[] => {
    const allExpenses = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses);

    const now = new Date();
    const results: {
        year: number;
        month: number;
        weeks: {
            calendarWeek: number;
            spent: number;
        }[];
    }[] = [];

    for (let i = 0; i < months; i++) {
        const monthDate = subMonths(now, i);
        const year = getYear(monthDate);
        const month = getMonth(monthDate);

        // Filter expenses for this month
        const expensesInMonth = allExpenses.filter((e) =>
            isSameMonth(new Date(e.date), monthDate),
        );

        // Gruppiere nach Kalenderwoche
        const weekMap = new Map<number, number>();
        for (const e of expensesInMonth) {
            const week = getWeek(new Date(e.date), { weekStartsOn: 1 });
            weekMap.set(week, (weekMap.get(week) ?? 0) + e.amount);
        }

        const weeks = Array.from(weekMap.entries())
            .map(([calendarWeek, spent]) => ({ calendarWeek, spent }))
            .sort((a, b) => a.calendarWeek - b.calendarWeek);

        results.push({
            year,
            month,
            weeks,
        });
    }

    return results;
};
