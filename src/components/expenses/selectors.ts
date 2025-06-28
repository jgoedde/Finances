import { expensesAdapter } from "@/components/expenses/slice.ts";
import { isSameMonth, isToday, isYesterday } from "date-fns";
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
