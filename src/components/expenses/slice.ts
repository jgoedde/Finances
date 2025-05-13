import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { Expense } from "@/components/use-expenses.ts";
import {
    loadExpenses,
    saveToLocalStorage,
} from "@/components/expenses/actions.ts";
import type { RootState } from "@/store.ts";

export interface ExpensesState {
    isDecrypting: boolean;
    isEncrypting: boolean;
    isInitial: boolean;
}

const initialState: ExpensesState = {
    isDecrypting: false,
    isEncrypting: false,
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
            state.isDecrypting = true;
            state.isInitial = false;
        });
        builder.addCase(loadExpenses.fulfilled, (state, action) => {
            expensesAdapter.setAll(state, action.payload);
            state.isDecrypting = false;
        });
        builder.addCase(loadExpenses.rejected, (state) => {
            state.isDecrypting = false;
        });
        builder.addCase(saveToLocalStorage.fulfilled, (state) => {
            state.isEncrypting = false;
        });
        builder.addCase(saveToLocalStorage.pending, (state) => {
            state.isEncrypting = true;
        });
        builder.addCase(saveToLocalStorage.rejected, (state) => {
            state.isEncrypting = false;
        });
    },
});

export const expensesSelectors = expensesAdapter.getSelectors<RootState>(
    (state) => state.expenses,
);

export const { addExpense, removeExpense, updateExpense, upsertExpense } =
    expensesSlice.actions;

export default expensesSlice.reducer;
