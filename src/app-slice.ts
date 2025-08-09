import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
    masterPassword?: string;
}

const initialState: AppState = {};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: () => ({
        setMasterPassword: (state, action) => {
            state.masterPassword = action.payload;
        },
    }),
    selectors: {
        selectMasterPassword: (state: AppState) => state.masterPassword,
    },
});

export const { setMasterPassword } = appSlice.actions;
export const { selectMasterPassword } = appSlice.selectors;

export const appReducer = appSlice.reducer;
