import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { createFixedCost } from "#/features/fixed-costs/create-fixed-cost.ts";
import { deleteFixedCost } from "#/features/fixed-costs/delete-fixed-cost.ts";
import { getFixedCost } from "#/features/fixed-costs/get-fixed-cost.ts";
import { listFixedCosts } from "#/features/fixed-costs/list-fixed-costs.ts";
import { updateFixedCost } from "#/features/fixed-costs/update-fixed-cost.ts";

export const fixedCostRoutes = new Hono<AppEnv>()
    .get("/", ...listFixedCosts)
    .get("/:id", ...getFixedCost)
    .post("/", ...createFixedCost)
    .patch("/:id", ...updateFixedCost)
    .delete("/:id", ...deleteFixedCost);
