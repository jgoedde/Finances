import { createSlice } from "@reduxjs/toolkit";
import {
    loadExpenses,
    saveToLocalStorage,
} from "@/components/expenses/actions.ts";

export interface AppState {
    masterPassword?: string;
    isShowingMore: boolean;
    isDecrypting: boolean;
    isEncrypting: boolean;
}

const initialState: AppState = {
    isShowingMore: false,
    isDecrypting: false,
    isEncrypting: false,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: () => ({
        showMore: (state) => {
            state.isShowingMore = true;
        },
        setMasterPassword: (state, action) => {
            state.masterPassword = action.payload;
        },
    }),
    extraReducers: (builder) => {
        builder.addCase(loadExpenses.pending, (state) => {
            state.isDecrypting = true;
        });
        builder.addCase(loadExpenses.fulfilled, (state) => {
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
    selectors: {
        selectIsShowingMore: (state: AppState) => state.isShowingMore,
        selectMasterPassword: (state: AppState) => state.masterPassword,
    },
});

export const { showMore, setMasterPassword } = appSlice.actions;
export const { selectIsShowingMore, selectMasterPassword } = appSlice.selectors;

export default appSlice.reducer;
