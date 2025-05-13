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

        const decrypted = await new Promise<string>((resolve) => {
            const worker = new Worker(
                new URL("@/workers/decrypt-worker.js", import.meta.url),
            );
            worker.postMessage({ ciphertext: encryptedLs, key });

            worker.onmessage = (e) => {
                const { decrypted, error: errorMessage } = e.data;
                if (errorMessage) throw new Error(errorMessage);
                else resolve(decrypted);
                worker.terminate();
            };
        });

        return JSON.parse(decrypted) as Expense[];
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
