import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { createCategory } from "#/features/categories/create-category.ts";
import { deleteCategory } from "#/features/categories/delete-category.ts";
import { getCategoryUsage } from "#/features/categories/get-category-usage.ts";
import { listCategories } from "#/features/categories/list-categories.ts";
import { listFixedCostCategories } from "#/features/categories/list-fixed-cost-categories.ts";
import { updateCategory } from "#/features/categories/update-category.ts";
import { updateFixedCostCategory } from "#/features/categories/update-fixed-cost-category.ts";

export const categoryRoutes = new Hono<AppEnv>()
    .get("/", ...listCategories)
    .post("/", ...createCategory)
    .get("/:id/usage", ...getCategoryUsage)
    .patch("/:id", ...updateCategory)
    .delete("/:id", ...deleteCategory);

export const fixedCostCategoryRoutes = new Hono<AppEnv>()
    .get("/", ...listFixedCostCategories)
    .patch("/:id", ...updateFixedCostCategory);
