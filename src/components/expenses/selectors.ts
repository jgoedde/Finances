import {
    expensesAdapter,
    expensesSelectors,
} from "@/components/expenses/slice.ts";
import { isSameMonth, isToday, isYesterday } from "date-fns";
import type { RootState } from "@/store.ts";
import { createSelector } from "@reduxjs/toolkit";

export const selectSpentToday = (state: RootState) => {
    const amountsToday = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isToday(e.date))
        .map((e) => e.amount);

    return amountsToday.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentThisMonth = (
    state: RootState,
    onlyPositive: boolean = false,
) => {
    const amountsThisMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) => isSameMonth(new Date(), e.date))
        .filter((e) => !onlyPositive || e.amount > 0)
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
    onlyPositive = false,
) => {
    const amountsThisMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter(
            (e) =>
                isSameMonth(new Date(e.date), new Date()) &&
                e.category.name === categoryName,
        )
        .filter((e) => !onlyPositive || e.amount > 0)
        .map((e) => e.amount);

    return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
};

export const selectSpentInMonth = (
    state: RootState,
    month: YearMonth,
    onlyPositive = false,
): number => {
    const amountsInMonth = expensesAdapter
        .getSelectors()
        .selectAll(state.expenses)
        .filter((e) =>
            isSameMonth(
                new Date(e.date),
                new Date(month.year, month.monthIndex),
            ),
        )
        .filter((e) => !onlyPositive || e.amount > 0)
        .map((e) => e.amount);

    return amountsInMonth.reduce((acc, amount) => acc + amount, 0);
};
export const selectExpensesInMonth = createSelector(
    (_: RootState, month: YearMonth) => month,
    expensesSelectors.selectAll,
    (month, expenses) =>
        expenses.filter((e) =>
            isSameMonth(
                new Date(e.date),
                new Date(month.year, month.monthIndex),
            ),
        ),
);
export type YearMonth = {
    year: number;
    monthIndex: number;
};
