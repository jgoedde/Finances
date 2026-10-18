import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { getMonthOverview } from "#/features/insights/get-month-overview.ts";
import { getPatterns } from "#/features/insights/get-patterns.ts";

export const insightRoutes = new Hono<AppEnv>()
    .get("/overview", ...getMonthOverview)
    .get("/patterns", ...getPatterns);
