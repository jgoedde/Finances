import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { loadExpenses } from "@/components/expenses/actions.ts";
import type { RootState } from "@/store.ts";
import type { Expense } from "@/components/expense.ts";

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
    selectors: {},
});

export const expensesSelectors = expensesAdapter.getSelectors<RootState>(
    (state) => state.expenses,
);

export const { removeExpense, upsertExpense } = expensesSlice.actions;

export default expensesSlice.reducer;
