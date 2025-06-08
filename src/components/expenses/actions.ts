import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptLocalStorageData, encrypt } from "@/lib/encryption-utils.ts";
import { isV1Persistence, type V2Storage } from "@/lib/app-local-storage.ts";
import type { RootState } from "@/store.ts";
import { fixedCostsSelectors } from "@/components/fixed-costs/slice.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";

/**
 * A Redux Toolkit async thunk for loading expenses from localStorage.
 * The expenses are stored in an encrypted format and are decrypted using a Web Worker.
 *
 * @returns {Promise<Expense[]>} A promise that resolves to an array of expenses.
 */
export const loadExpenses = createAsyncThunk(
    "expenses/load",
    async ({ key }: { key: string }) => {
        const data = await decryptLocalStorageData(key);

        if (isV1Persistence(data)) {
            throw new Error("Detected v1 persistence format in localStorage.");
        }

        return data.expenses;
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

        const encrypted = await encrypt(
            JSON.stringify({
                fixedCosts: fixedCostsSelectors.selectAll(state),
                expenses: expensesSelectors.selectAll(state),
                version: 2,
            } as V2Storage),
            encryptionKey,
        );

        localStorage.setItem("expenses", encrypted);
    },
);
