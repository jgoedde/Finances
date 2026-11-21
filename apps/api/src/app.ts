import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Auth } from "./auth/auth.ts";
import type { DB } from "./db/database.ts";
import {
    categoryRoutes,
    fixedCostCategoryRoutes,
} from "./features/categories/routes.ts";
import { defaultCategoryRoutes } from "./features/default-categories/routes.ts";
import { dataTransferRoutes } from "./features/data-transfer/routes.ts";
import { fixedCostRoutes } from "./features/fixed-costs/routes.ts";
import { insightRoutes } from "./features/insights/routes.ts";
import { adminLinkRoutes, linkRoutes } from "./features/links/routes.ts";
import { transactionRoutes } from "./features/transactions/routes.ts";
import { type AppEnv, requireAdmin, requireUser } from "./http/session.ts";

/**
 * The API under `/api`. The routers the web client calls are mounted in one
 * chained expression so {@link AppType} keeps their routes: a `.route(...)`
 * or `.get(...)` outside the chain is invisible to the client.
 */
export function createApp(db: DB, auth: Auth) {
    const app = new Hono<AppEnv>().basePath("/api");

    // Replaces Hono's default handler, which writes to `console.error`; the
    // request logger logs the error (`c.error`) with the request line.
    // Hono's own errors (e.g. malformed JSON, 400) keep their status.
    app.onError((error, c) =>
        error instanceof HTTPException
            ? c.json({ error: "invalid_request" }, error.status)
            : c.text("Internal Server Error", 500),
    );

    // Endpoints take their dependencies from the context.
    app.use(async (c, next) => {
        c.set("db", db);
        c.set("auth", auth);
        await next();
    });

    // Not part of `AppType`: the web uses the better-auth client.
    app.get("/health", (c) => c.json({ ok: true }));
    app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));

    return (
        app
            .route("/links", linkRoutes)
            // `/path/*` also matches `/path`.
            .use("/transactions/*", requireUser)
            .route("/transactions", transactionRoutes)
            .use("/categories/*", requireUser)
            .route("/categories", categoryRoutes)
            .use("/fixed-cost-categories/*", requireUser)
            .route("/fixed-cost-categories", fixedCostCategoryRoutes)
            .use("/fixed-costs/*", requireUser)
            .route("/fixed-costs", fixedCostRoutes)
            .use("/insights/*", requireUser)
            .route("/insights", insightRoutes)
            .use("/data/*", requireUser)
            .route("/data", dataTransferRoutes)
            .use("/admin/*", requireUser, requireAdmin)
            .route("/admin", adminLinkRoutes)
            .route("/admin/default-categories", defaultCategoryRoutes)
    );
}

/**
 * The type of the API's router, for the web's typed client (`hc<AppType>`).
 */
export type AppType = ReturnType<typeof createApp>;
