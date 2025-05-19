import { configureStore } from "@reduxjs/toolkit";
import { expensesSlice } from "@/components/expenses/slice.ts";
import { createLogger } from "redux-logger";

export const store = configureStore({
    reducer: {
        expenses: expensesSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        const logger = createLogger();
        return getDefaultMiddleware().concat(logger);
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
