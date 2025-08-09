import { configureStore } from "@reduxjs/toolkit";
import { expensesReducer } from "@/components/expenses/slice.ts";
import { appReducer } from "@/app-slice.ts";
import { fixedCostsReducer } from "@/components/fixed-costs/slice.ts";

export const store = configureStore({
    reducer: {
        app: appReducer,
        expenses: expensesReducer,
        fixedCosts: fixedCostsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
