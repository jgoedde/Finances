import { createAsyncThunk } from "@reduxjs/toolkit";
import type { FixedCost } from "@/components/fixed-costs/fixed-cost.ts";

export const loadFixedCosts = createAsyncThunk("fixedCosts/load", async () => {
    return [] as FixedCost[];
});
