import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store.ts";
import {
    calculateMonthlyFixedCosts,
    type FixedCost,
    getCostsWithinMonth,
} from "@/components/fixed-costs/fixed-cost.ts";
import { loadFixedCosts } from "@/components/fixed-costs/actions.ts";

export interface FixedCostsState {}

const initialState: FixedCostsState = {};

export const fixedCostsAdapter = createEntityAdapter({
    selectId: (a: FixedCost) => a.id,
});

export const fixedCostsSlice = createSlice({
    name: "fixedCosts",
    initialState: fixedCostsAdapter.getInitialState({ ...initialState }),
    reducers: {
        addFixedCost: fixedCostsAdapter.addOne,
        updateFixedCost: fixedCostsAdapter.updateOne,
        removeFixedCost: fixedCostsAdapter.removeOne,
        setFixedCosts: fixedCostsAdapter.setAll,
        clearFixedCosts: fixedCostsAdapter.removeAll,
    },
    extraReducers: (builder) => {
        builder.addCase(loadFixedCosts.fulfilled, (state, action) => {
            fixedCostsAdapter.setAll(state, action.payload);
        });
    },
    selectors: {
        selectMonthlyFixCosts: (state) => {
            const fixedCosts = fixedCostsAdapter
                .getSelectors()
                .selectAll(state)
                .filter((fc) => fc.amount >= 0);

            return getCostsWithinMonth(fixedCosts);
        },
        selectMonthlyIncome: (state) => {
            const negativeFixCosts = fixedCostsAdapter
                .getSelectors()
                .selectAll(state)
                .filter((fc) => fc.amount < 0);

            return calculateMonthlyFixedCosts(negativeFixCosts) * -1;
        },
    },
});

export const fixedCostsSelectors = fixedCostsAdapter.getSelectors<RootState>(
    (state) => state.fixedCosts,
);
export const { selectMonthlyFixCosts, selectMonthlyIncome } =
    fixedCostsSlice.selectors;

export default fixedCostsSlice.reducer;
