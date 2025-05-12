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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
