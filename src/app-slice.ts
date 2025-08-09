import { createSlice } from "@reduxjs/toolkit";
import {
    encryptAndUpdateGist,
    loadExpenses,
} from "@/components/expenses/actions.ts";

export interface AppState {
    masterPassword?: string;
    isDecrypting: boolean;
    isEncrypting: boolean;
}

const initialState: AppState = {
    isDecrypting: false,
    isEncrypting: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: () => ({
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
        builder.addCase(encryptAndUpdateGist.fulfilled, (state) => {
            state.isEncrypting = false;
        });
        builder.addCase(encryptAndUpdateGist.pending, (state) => {
            state.isEncrypting = true;
        });
        builder.addCase(encryptAndUpdateGist.rejected, (state) => {
            state.isEncrypting = false;
        });
    },
    selectors: {
        selectMasterPassword: (state: AppState) => state.masterPassword,
    },
});

export const { setMasterPassword } = appSlice.actions;
export const { selectMasterPassword } = appSlice.selectors;

export const appReducer = appSlice.reducer;
