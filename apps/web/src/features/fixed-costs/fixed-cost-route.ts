import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { apiErrorCode } from "#/api/api-errors.ts";
import {
    fixedCostCategoriesQuery,
    fixedCostQuery,
} from "#/features/fixed-costs/fixed-cost-queries.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Loader of the routes of one fixed cost: the fixed cost and the categories.
 */
export function loadFixedCost(queryClient: QueryClient, id: string) {
    return Promise.all([
        queryClient.query({ ...fixedCostQuery(id), staleTime: "static" }),
        queryClient.query({ ...fixedCostCategoriesQuery, staleTime: "static" }),
    ]);
}

/**
 * `onError` of the routes of one fixed cost: reports the error and goes
 * back to the list.
 */
export function redirectToFixedCosts(error: Error): never {
    toast.error(
        apiErrorCode(error) === "not_found"
            ? m.fixed_cost_not_found()
            : m.error_unexpected(),
    );
    throw redirect({ to: "/fixed-costs" });
}
