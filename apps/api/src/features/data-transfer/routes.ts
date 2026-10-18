import { Hono } from "hono";
import type { AppEnv } from "#/http/session.ts";
import { exportData } from "#/features/data-transfer/export-data.ts";
import { importData } from "#/features/data-transfer/import-data.ts";

export const dataTransferRoutes = new Hono<AppEnv>()
    .get("/export", ...exportData)
    .post("/import", ...importData);
