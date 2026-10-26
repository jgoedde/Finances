import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { getFixedCostSuggestion } from "#/features/insights/get-fixed-cost-suggestion.ts";
import { getMonthOverview } from "#/features/insights/get-month-overview.ts";
import { getPatterns } from "#/features/insights/get-patterns.ts";

export const insightRoutes = new Hono<AppEnv>()
    .get("/overview", ...getMonthOverview)
    .get("/patterns", ...getPatterns)
    .get("/fixed-cost-suggestion", ...getFixedCostSuggestion);
