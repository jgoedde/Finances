import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store.ts";
import {
    type FixedCost,
    getCostsWithinMonth,
    isIncome,
} from "@/components/fixed-costs/fixed-cost.ts";
import { loadFixedCosts } from "@/components/fixed-costs/actions.ts";

export const fixedCostsAdapter = createEntityAdapter({
    selectId: (a: FixedCost) => a.id,
});

const fixedCostsSlice = createSlice({
    name: "fixedCosts",
    initialState: fixedCostsAdapter.getInitialState(),
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
        selectMonthlyFixCosts: createSelector(
            fixedCostsAdapter.getSelectors().selectAll,
            (allFixedCosts) => {
                const fixedCosts = allFixedCosts.filter((fc) => !isIncome(fc));
                return getCostsWithinMonth(fixedCosts);
            },
        ),
        selectMonthlyIncome: createSelector(
            fixedCostsAdapter.getSelectors().selectAll,
            (allFixedCosts) => {
                const negativeFixCosts = allFixedCosts.filter(isIncome);
                return (
                    getCostsWithinMonth(negativeFixCosts).reduce(
                        (acc, fc) => acc + fc.amount,
                        0,
                    ) * -1
                );
            },
        ),
    },
});

export const fixedCostsSelectors = fixedCostsAdapter.getSelectors<RootState>(
    (state) => state.fixedCosts,
);
export const { selectMonthlyFixCosts, selectMonthlyIncome } =
    fixedCostsSlice.selectors;

export const { setFixedCosts } = fixedCostsSlice.actions;

export const fixedCostsReducer = fixedCostsSlice.reducer;
