import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "@/app-slice.ts";
import { fixedCostsReducer } from "@/components/fixed-costs/slice.ts";

export const store = configureStore({
    reducer: {
        app: appReducer,
        fixedCosts: fixedCostsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
