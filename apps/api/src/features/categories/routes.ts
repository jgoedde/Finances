import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { listCategories } from "#/features/categories/list-categories.ts";
import { listFixedCostCategories } from "#/features/categories/list-fixed-cost-categories.ts";

export const categoryRoutes = new Hono<AppEnv>().get("/", ...listCategories);

export const fixedCostCategoryRoutes = new Hono<AppEnv>().get(
    "/",
    ...listFixedCostCategories,
);
