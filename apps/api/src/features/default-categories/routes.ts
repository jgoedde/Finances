import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { createDefaultCategory } from "#/features/default-categories/create-default-category.ts";
import { deleteDefaultCategory } from "#/features/default-categories/delete-default-category.ts";
import { listDefaultCategories } from "#/features/default-categories/list-default-categories.ts";
import { updateDefaultCategory } from "#/features/default-categories/update-default-category.ts";

/**
 * Admin-only: the instance's default categories.
 */
export const defaultCategoryRoutes = new Hono<AppEnv>()
    .get("/", ...listDefaultCategories)
    .post("/", ...createDefaultCategory)
    .patch("/:id", ...updateDefaultCategory)
    .delete("/:id", ...deleteDefaultCategory);
