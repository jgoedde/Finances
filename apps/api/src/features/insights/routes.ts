import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { getMonthOverview } from "#/features/insights/get-month-overview.ts";

export const insightRoutes = new Hono<AppEnv>().get(
    "/overview",
    ...getMonthOverview,
);
