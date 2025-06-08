import { configureStore } from "@reduxjs/toolkit";
import { expensesSlice } from "@/components/expenses/slice.ts";
import { createLogger } from "redux-logger";
import { fixedCostsSlice } from "@/components/fixed-costs/slice.ts";
import { appSlice } from "@/app-slice.ts";

export const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        expenses: expensesSlice.reducer,
        fixedCosts: fixedCostsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        const logger = createLogger();
        return getDefaultMiddleware().concat(
            import.meta.env.PROD ? [] : [logger],
        );
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
