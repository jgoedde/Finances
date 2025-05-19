import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import { readLocalStorageValue } from "@mantine/hooks";
import type { Expense } from "@/components/expense.ts";

/**
 * A Redux Toolkit async thunk for loading expenses from localStorage.
 * The expenses are stored in an encrypted format and are decrypted using a Web Worker.
 *
 * @returns {Promise<Expense[]>} A promise that resolves to an array of expenses.
 */
export const loadExpenses = createAsyncThunk(
    "expenses/load",
    async ({ key }: { key: string }) => {
        const encryptedLs = readLocalStorageValue({
            key: "expenses",
            defaultValue: "",
        });

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
 * A Redux Toolkit async thunk for saving expenses to localStorage.
 * The expenses are encrypted using a Web Worker before being stored.
 *
 * @returns {Promise<void>} A promise that resolves when the expenses are successfully saved.
 */
export const saveToLocalStorage = createAsyncThunk(
    "expenses/save",
    async ({ encryptionKey }: { encryptionKey: string }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        const expenses = expensesSelectors.selectAll(state);

        const encrypted = await new Promise<string>((resolve) => {
            const worker = new Worker(
                new URL("@/workers/encrypt-worker.js", import.meta.url),
            );
            worker.postMessage({
                plaintext: JSON.stringify(expenses),
                key: encryptionKey,
            });

            worker.onmessage = (e) => {
                const { encrypted, error: errorMessage } = e.data;
                if (errorMessage) throw new Error(errorMessage);
                else resolve(encrypted);
                worker.terminate();
            };
        });

        localStorage.setItem("expenses", encrypted);
    },
);
