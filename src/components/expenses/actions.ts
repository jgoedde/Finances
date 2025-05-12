import { createAsyncThunk } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import type { Expense } from "@/components/use-expenses.ts";
import type { RootState } from "@/store.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";

/**
 * Loads encrypted expenses from local storage, decrypts them using the provided key,
 * and returns the parsed expenses sorted by date in descending order.
 */
export const loadExpenses = createAsyncThunk(
    "expenses/load",
    async ({ key }: { key: string }) => {
        const encryptedLs = localStorage.getItem("expenses");

        if (!encryptedLs) {
            return [];
        }

        const decrypted = CryptoJS.AES.decrypt(encryptedLs, key).toString(
            CryptoJS.enc.Utf8,
        );
        const parsed = JSON.parse(decrypted) as Expense[];
        parsed.sort((a, b) => b.date - a.date);

        return parsed;
    },
);

/**
 * Encrypts the provided expenses using the provided encryption key and saves them to local storage.
 */
export const saveToLocalStorage = createAsyncThunk(
    "expenses/save",
    ({ encryptionKey }: { encryptionKey: string }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        const expenses = expensesSelectors.selectAll(state);

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(expenses),
            encryptionKey,
        ).toString();

        localStorage.setItem("expenses", encrypted);
    },
);
