import { createAsyncThunk } from "@reduxjs/toolkit";
import { decryptLocalStorageData } from "@/lib/encryption-utils.ts";
import { isV1Persistence } from "@/lib/app-local-storage.ts";

export const loadFixedCosts = createAsyncThunk(
    "fixedCosts/load",
    async ({ key }: { key: string }) => {
        const data = await decryptLocalStorageData(key);

        if (isV1Persistence(data)) {
            throw new Error(
                "Fixed costs are not supported in v1 persistence format.",
            );
        }

        return data.fixedCosts;
    },
);
