import { createAsyncThunk } from "@reduxjs/toolkit";
import { type Db, decryptDatabase, encrypt } from "@/lib/encryption-utils.ts";
import type { RootState } from "@/store.ts";
import { fixedCostsSelectors } from "@/components/fixed-costs/slice.ts";
import { selectAllExpenses } from "@/components/expenses/slice.ts";
import type { GitHubClient } from "@/gitHubClient.tsx";

export const loadExpenses = createAsyncThunk(
    "expenses/load",
    async ({
        key,
        gistId,
        apiClient,
    }: {
        key: string;
        gistId: string;
        apiClient: GitHubClient;
    }) => {
        const gistResponse = await apiClient.gists.get({
            gist_id: gistId,
        });

        const file = Object.values(gistResponse.data.files || {})[0]?.filename;

        const encryptedData =
            file == null
                ? undefined
                : (gistResponse.data.files ?? {})[file]?.content;

        if (!encryptedData) {
            throw new Error("No encrypted data found in the Gist.");
        }

        const data = await decryptDatabase(encryptedData, key);

        return data.expenses;
    },
);

export const encryptAndUpdateGist = createAsyncThunk(
    "expenses/save",
    async (
        {
            key,
            gistId,
            gistName,
            apiClient,
        }: {
            key: string;
            gistId: string;
            gistName: string;
            apiClient: GitHubClient;
        },
        thunkAPI,
    ) => {
        const state = thunkAPI.getState() as RootState;

        const encrypted = await encrypt(
            JSON.stringify({
                fixedCosts: fixedCostsSelectors.selectAll(state),
                expenses: selectAllExpenses(state),
                version: 2,
            } as Db),
            key,
        );

        await apiClient.gists.update({
            gist_id: gistId,
            files: {
                [gistName]: {
                    content: encrypted,
                },
            },
        });
    },
);
