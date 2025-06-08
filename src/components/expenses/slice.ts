import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { loadExpenses } from "@/components/expenses/actions.ts";
import type { RootState } from "@/store.ts";
import type { Expense } from "@/components/expense.ts";
import { isSameMonth, isToday, isYesterday } from "date-fns";

export interface ExpensesState {
    isInitial: boolean;
}

const initialState: ExpensesState = {
    isInitial: true,
};

export const expensesAdapter = createEntityAdapter({
    selectId: (a: Expense) => a.id,
    sortComparer: (a: Expense, b: Expense) => b.date - a.date,
});

export const expensesSlice = createSlice({
    name: "expenses",
    initialState: expensesAdapter.getInitialState({ ...initialState }),
    reducers: {
        addExpense: expensesAdapter.addOne,
        removeExpense: expensesAdapter.removeOne,
        updateExpense: expensesAdapter.updateOne,
        upsertExpense: expensesAdapter.upsertOne,
    },
    extraReducers: (builder) => {
        builder.addCase(loadExpenses.pending, (state) => {
            state.isInitial = false;
        });
        builder.addCase(loadExpenses.fulfilled, (state, action) => {
            expensesAdapter.setAll(state, action.payload);
        });
    },
    selectors: {
        selectSpentToday: (state) => {
            const amountsToday = expensesAdapter
                .getSelectors()
                .selectAll(state)
                .filter((e) => isToday(e.date))
                .map((e) => e.amount);

            return amountsToday.reduce((acc, amount) => acc + amount, 0);
        },
        selectSpentThisMonth: (state) => {
            const amountsThisMonth = expensesAdapter
                .getSelectors()
                .selectAll(state)
                .filter((e) => isSameMonth(new Date(), e.date))
                .map((e) => e.amount);

            return amountsThisMonth.reduce((acc, amount) => acc + amount, 0);
        },
        selectSpentYesterday: (state) => {
            const amountsYesterday = expensesAdapter
                .getSelectors()
                .selectAll(state)
                .filter((e) => isYesterday(e.date))
                .map((e) => e.amount);

            return amountsYesterday.reduce((acc, amount) => acc + amount, 0);
        },
    },
});

export const expensesSelectors = expensesAdapter.getSelectors<RootState>(
    (state) => state.expenses,
);

export const { removeExpense, upsertExpense } = expensesSlice.actions;

export const { selectSpentToday, selectSpentThisMonth, selectSpentYesterday } =
    expensesSlice.selectors;

export default expensesSlice.reducer;
